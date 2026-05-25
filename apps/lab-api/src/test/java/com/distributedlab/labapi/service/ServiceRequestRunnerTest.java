package com.distributedlab.labapi.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import com.distributedlab.labapi.model.ServiceRequest;
import com.distributedlab.labapi.model.ServiceRequestResult;
import com.distributedlab.labapi.model.ServiceRequestResult.ResultStatus;
import com.distributedlab.labapi.model.ServiceRequestTarget;
import com.distributedlab.labapi.model.ServiceRequestTarget.TargetStatus;
import com.distributedlab.labapi.service.ServiceTargetRegistry.ResolvedServiceTarget;
import java.net.URI;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

class ServiceRequestRunnerTest {

  private FakeServiceTargetRegistry targetRegistry;
  private MockRestServiceServer server;
  private ServiceRequestRunner runner;

  @BeforeEach
  void setUp() {
    RestTemplate restTemplate = new RestTemplate();
    targetRegistry = new FakeServiceTargetRegistry();
    server = MockRestServiceServer.createServer(restTemplate);
    runner = new ServiceRequestRunner(restTemplate, targetRegistry);
  }

  @Test
  void dispatchesAllowedTargetRequest() {
    targetRegistry.resolvedTarget = Optional.of(resolvedReadyTarget());
    server.expect(once(), requestTo("http://catalog-service:8081/api/catalog?limit=5"))
        .andExpect(method(HttpMethod.GET))
        .andRespond(withSuccess("[{\"id\":1}]", MediaType.APPLICATION_JSON));

    ServiceRequestResult result = runner.run(new ServiceRequest(
        "catalog-service",
        "GET",
        "/api/catalog",
        Map.of("limit", "5"),
        Map.of("X-Lab-Scenario", "baseline"),
        null,
        5000,
        "req-1"));

    assertThat(result.status()).isEqualTo(ResultStatus.succeeded);
    assertThat(result.httpStatus()).isEqualTo(200);
    assertThat(result.bodyPreview()).contains("\"id\":1");
    assertThat(result.targetId()).isEqualTo("catalog-service");
    assertThat(result.method()).isEqualTo("GET");
    assertThat(result.path()).isEqualTo("/api/catalog");
    server.verify();
  }

  @Test
  void blocksUnsafeAbsolutePathsBeforeDispatch() {
    ServiceRequestResult result = runner.run(new ServiceRequest(
        "catalog-service",
        "GET",
        "http://example.test/api",
        Map.of(),
        Map.of(),
        null,
        5000,
        "req-2"));

    assertThat(result.status()).isEqualTo(ResultStatus.blocked);
    assertThat(result.fieldErrors()).containsKey("path");
  }

  @Test
  void blocksUnsupportedMethods() {
    targetRegistry.resolvedTarget = Optional.of(resolvedReadyTarget());

    ServiceRequestResult result = runner.run(new ServiceRequest(
        "catalog-service",
        "POST",
        "/api/catalog",
        Map.of(),
        Map.of(),
        "{}",
        5000,
        "req-3"));

    assertThat(result.status()).isEqualTo(ResultStatus.blocked);
    assertThat(result.fieldErrors()).containsEntry(
        "method",
        "Method is not supported by the selected target.");
  }

  @Test
  void returnsTargetUnavailableForStoppedTargets() {
    targetRegistry.resolvedTarget = Optional.of(new ResolvedServiceTarget(
        target(TargetStatus.unavailable),
        URI.create("http://catalog-service:8081")));

    ServiceRequestResult result = runner.run(new ServiceRequest(
        "catalog-service",
        "GET",
        "/api/catalog",
        Map.of(),
        Map.of(),
        null,
        5000,
        "req-4"));

    assertThat(result.status()).isEqualTo(ResultStatus.failed);
    assertThat(result.errorCategory()).isEqualTo("target_unavailable");
  }

  @Test
  void truncatesLargeResponseBodies() {
    targetRegistry.resolvedTarget = Optional.of(resolvedReadyTarget());
    server.expect(requestTo("http://catalog-service:8081/api/catalog"))
        .andRespond(withSuccess("x".repeat(4100), MediaType.TEXT_PLAIN));

    ServiceRequestResult result = runner.run(new ServiceRequest(
        "catalog-service",
        "GET",
        "/api/catalog",
        Map.of(),
        Map.of(),
        null,
        5000,
        "req-5"));

    assertThat(result.bodyTruncated()).isTrue();
    assertThat(result.bodyPreview()).hasSize(4000);
  }

  @Test
  void mapsResourceAccessFailuresToTimeoutResults() {
    targetRegistry.resolvedTarget = Optional.of(resolvedReadyTarget());
    server.expect(requestTo("http://catalog-service:8081/api/catalog"))
        .andRespond(request -> {
          throw new ResourceAccessException("Read timed out");
        });

    ServiceRequestResult result = runner.run(new ServiceRequest(
        "catalog-service",
        "GET",
        "/api/catalog",
        Map.of(),
        Map.of(),
        null,
        5000,
        "req-6"));

    assertThat(result.status()).isEqualTo(ResultStatus.timed_out);
    assertThat(result.errorCategory()).isEqualTo("timeout");
    assertThat(result.durationMs()).isGreaterThanOrEqualTo(5000);
  }

  @Test
  void includesOutcomeFieldsUsedByStructuredLogs() {
    ServiceRequestResult result = runner.run(new ServiceRequest(
        "",
        "",
        "",
        Map.of(),
        Map.of(),
        null,
        5000,
        "req-7"));

    assertThat(result.status()).isEqualTo(ResultStatus.blocked);
    assertThat(result.errorCategory()).isEqualTo("validation");
    assertThat(result.durationMs()).isGreaterThanOrEqualTo(0);
    assertThat(result.startedAt()).isNotNull();
    assertThat(result.completedAt()).isNotNull();
  }

  private ResolvedServiceTarget resolvedReadyTarget() {
    return new ResolvedServiceTarget(
        target(TargetStatus.ready),
        URI.create("http://catalog-service:8081"));
  }

  private ServiceRequestTarget target(TargetStatus status) {
    return new ServiceRequestTarget(
        "catalog-service",
        "Catalog Service",
        status,
        List.of("migration"),
        List.of("GET"),
        "/actuator/health",
        Instant.parse("2026-05-24T00:00:00Z"));
  }

  private static class FakeServiceTargetRegistry extends ServiceTargetRegistry {

    private Optional<ResolvedServiceTarget> resolvedTarget = Optional.empty();

    FakeServiceTargetRegistry() {
      super(null);
    }

    @Override
    public Optional<ResolvedServiceTarget> resolve(String targetId) {
      return resolvedTarget;
    }
  }
}
