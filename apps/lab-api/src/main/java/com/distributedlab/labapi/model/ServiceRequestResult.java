package com.distributedlab.labapi.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ServiceRequestResult(
    String id,
    String targetId,
    String method,
    String path,
    ResultStatus status,
    Integer httpStatus,
    long durationMs,
    Map<String, String> responseHeaders,
    String bodyPreview,
    boolean bodyTruncated,
    String errorCategory,
    String errorMessage,
    Map<String, String> fieldErrors,
    Instant startedAt,
    Instant completedAt) {

  public enum ResultStatus {
    pending, succeeded, failed, timed_out, blocked
  }
}
