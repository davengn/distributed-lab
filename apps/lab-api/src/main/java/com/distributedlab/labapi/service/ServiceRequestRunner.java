package com.distributedlab.labapi.service;

import com.distributedlab.labapi.model.ServiceRequest;
import com.distributedlab.labapi.model.ServiceRequestResult;
import com.distributedlab.labapi.model.ServiceRequestResult.ResultStatus;
import com.distributedlab.labapi.model.ServiceRequestTarget.TargetStatus;
import com.distributedlab.labapi.service.ServiceTargetRegistry.ResolvedServiceTarget;
import java.net.URI;
import java.time.Duration;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class ServiceRequestRunner {

  private static final Logger log = LoggerFactory.getLogger(ServiceRequestRunner.class);
  private static final int DEFAULT_TIMEOUT_MS = 5000;
  private static final int MIN_TIMEOUT_MS = 500;
  private static final int MAX_TIMEOUT_MS = 10000;
  private static final int BODY_PREVIEW_LIMIT = 4000;

  private final RestTemplate restTemplate;
  private final ServiceTargetRegistry targetRegistry;

  public ServiceRequestRunner(RestTemplate restTemplate, ServiceTargetRegistry targetRegistry) {
    this.restTemplate = restTemplate;
    this.targetRegistry = targetRegistry;
  }

  public ServiceRequestResult run(ServiceRequest request) {
    Instant startedAt = Instant.now();
    String requestId = request.clientRequestId() == null
        || request.clientRequestId().isBlank()
        ? "req-" + startedAt.toEpochMilli()
        : request.clientRequestId();

    Map<String, String> fieldErrors = validateRequestFields(request);
    if (!fieldErrors.isEmpty()) {
      ServiceRequestResult result = blocked(
          requestId, request, fieldErrors, startedAt, "Request validation failed.");
      logOutcome(result);
      return result;
    }

    ResolvedServiceTarget resolvedTarget = targetRegistry.resolve(request.targetId()).orElse(null);
    if (resolvedTarget == null
        || resolvedTarget.target().status() == TargetStatus.unavailable
        || resolvedTarget.target().status() == TargetStatus.unknown) {
      ServiceRequestResult result = failed(
          requestId,
          request,
          "target_unavailable",
          "Target service is not available in the local lab environment.",
          startedAt,
          null,
          null,
          null);
      logOutcome(result);
      return result;
    }

    String method = normalizeMethod(request.method());
    if (!resolvedTarget.target().allowedMethods().contains(method)) {
      ServiceRequestResult result = blocked(
          requestId,
          request,
          Map.of("method", "Method is not supported by the selected target."),
          startedAt,
          "Request validation failed.");
      logOutcome(result);
      return result;
    }

    try {
      URI uri = buildUri(resolvedTarget.baseUri(), request);
      ResponseEntity<String> response = restTemplate.exchange(
          uri,
          HttpMethod.valueOf(method),
          new HttpEntity<>(request.body(), headersFrom(request.headers())),
          String.class);
      ServiceRequestResult result = fromResponse(requestId, request, response, startedAt);
      logOutcome(result);
      return result;
    } catch (HttpStatusCodeException e) {
      ServiceRequestResult result = failed(
          requestId,
          request,
          "downstream_error",
          "The target service returned HTTP " + e.getStatusCode().value() + ".",
          startedAt,
          e.getStatusCode().value(),
          e.getResponseHeaders() != null ? e.getResponseHeaders().toSingleValueMap() : null,
          e.getResponseBodyAsString());
      logOutcome(result);
      return result;
    } catch (ResourceAccessException e) {
      ServiceRequestResult result = timedOut(requestId, request, startedAt);
      logOutcome(result);
      return result;
    } catch (RestClientException | IllegalArgumentException e) {
      ServiceRequestResult result = failed(
          requestId,
          request,
          "downstream_error",
          "The request could not be completed: " + e.getMessage(),
          startedAt,
          null,
          null,
          null);
      logOutcome(result);
      return result;
    }
  }

  private Map<String, String> validateRequestFields(ServiceRequest request) {
    Map<String, String> errors = new LinkedHashMap<>();
    if (request.targetId() == null || request.targetId().isBlank()) {
      errors.put("targetId", "Target service is required.");
    }
    if (request.method() == null || request.method().isBlank()) {
      errors.put("method", "Request method is required.");
    }
    if (request.path() == null || request.path().isBlank()) {
      errors.put("path", "Path is required.");
    } else if (!isSafeRelativePath(request.path())) {
      errors.put("path", "Path must be relative, start with /, and stay within the service.");
    }
    if (request.timeoutMs() != null
        && (request.timeoutMs() < MIN_TIMEOUT_MS || request.timeoutMs() > MAX_TIMEOUT_MS)) {
      errors.put("timeoutMs", "Timeout must be between 500 and 10000 milliseconds.");
    }
    if (request.headers() != null) {
      request.headers().forEach((key, value) -> {
        if (key == null || key.isBlank()) {
          errors.put("headers", "Header names must be non-empty.");
        }
      });
    }
    return errors;
  }

  private static boolean isSafeRelativePath(String path) {
    String lower = path.toLowerCase(Locale.ROOT);
    return path.startsWith("/")
        && !path.startsWith("//")
        && !lower.contains("://")
        && !path.contains("..");
  }

  private static URI buildUri(URI baseUri, ServiceRequest request) {
    UriComponentsBuilder builder = UriComponentsBuilder.fromUri(baseUri)
        .path(request.path());
    if (request.query() != null) {
      request.query().forEach((key, value) -> {
        if (key != null && !key.isBlank()) {
          builder.queryParam(key, value == null ? "" : value);
        }
      });
    }
    return builder.build(true).toUri();
  }

  private static HttpHeaders headersFrom(Map<String, String> requestHeaders) {
    HttpHeaders headers = new HttpHeaders();
    if (requestHeaders != null) {
      requestHeaders.forEach((key, value) -> {
        if (key != null && !key.isBlank() && value != null) {
          headers.set(key, value);
        }
      });
    }
    return headers;
  }

  private static ServiceRequestResult fromResponse(
      String requestId,
      ServiceRequest request,
      ResponseEntity<String> response,
      Instant startedAt) {
    BodyPreview preview = preview(response.getBody());
    boolean succeeded = response.getStatusCode().is2xxSuccessful();
    Instant completedAt = Instant.now();
    return new ServiceRequestResult(
        requestId,
        request.targetId(),
        normalizeMethod(request.method()),
        request.path(),
        succeeded ? ResultStatus.succeeded : ResultStatus.failed,
        response.getStatusCode().value(),
        durationMs(startedAt, completedAt),
        response.getHeaders().toSingleValueMap(),
        preview.body(),
        preview.truncated(),
        succeeded ? null : "downstream_error",
        succeeded ? null : "The target service returned a non-success response.",
        null,
        startedAt,
        completedAt);
  }

  private static ServiceRequestResult blocked(
      String requestId,
      ServiceRequest request,
      Map<String, String> fieldErrors,
      Instant startedAt,
      String message) {
    Instant completedAt = Instant.now();
    return new ServiceRequestResult(
        requestId,
        request.targetId(),
        normalizeMethod(request.method()),
        request.path(),
        ResultStatus.blocked,
        null,
        durationMs(startedAt, completedAt),
        null,
        null,
        false,
        "validation",
        message,
        fieldErrors,
        startedAt,
        completedAt);
  }

  private static ServiceRequestResult failed(
      String requestId,
      ServiceRequest request,
      String category,
      String message,
      Instant startedAt,
      Integer httpStatus,
      Map<String, String> headers,
      String body) {
    BodyPreview preview = preview(body);
    Instant completedAt = Instant.now();
    return new ServiceRequestResult(
        requestId,
        request.targetId(),
        normalizeMethod(request.method()),
        request.path(),
        ResultStatus.failed,
        httpStatus,
        durationMs(startedAt, completedAt),
        headers,
        preview.body(),
        preview.truncated(),
        category,
        message,
        null,
        startedAt,
        completedAt);
  }

  private static ServiceRequestResult timedOut(
      String requestId, ServiceRequest request, Instant startedAt) {
    Instant completedAt = Instant.now();
    long duration = Math.max(
        request.timeoutMs() == null ? DEFAULT_TIMEOUT_MS : request.timeoutMs(),
        durationMs(startedAt, completedAt));
    return new ServiceRequestResult(
        requestId,
        request.targetId(),
        normalizeMethod(request.method()),
        request.path(),
        ResultStatus.timed_out,
        null,
        duration,
        null,
        null,
        false,
        "timeout",
        "The request exceeded the configured timeout.",
        null,
        startedAt,
        completedAt);
  }

  private static BodyPreview preview(String body) {
    if (body == null || body.isBlank()) {
      return new BodyPreview("", false);
    }
    if (body.length() <= BODY_PREVIEW_LIMIT) {
      return new BodyPreview(body, false);
    }
    return new BodyPreview(body.substring(0, BODY_PREVIEW_LIMIT), true);
  }

  private static String normalizeMethod(String method) {
    return method == null ? null : method.toUpperCase(Locale.ROOT).trim();
  }

  private static long durationMs(Instant startedAt, Instant completedAt) {
    return Math.max(0, Duration.between(startedAt, completedAt).toMillis());
  }

  private static void logOutcome(ServiceRequestResult result) {
    log.info(
        "service_request outcome target={} method={} path={} status={} durationMs={} "
            + "errorCategory={}",
        result.targetId(),
        result.method(),
        result.path(),
        result.status(),
        result.durationMs(),
        result.errorCategory());
  }

  private record BodyPreview(String body, boolean truncated) {}
}
