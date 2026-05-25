package com.distributedlab.labapi.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record TestingUtilityRun(
    String utilityId,
    UtilityStatus status,
    String message,
    Map<String, Object> details,
    Long durationMs,
    Instant completedAt) {

  public enum UtilityStatus {
    pending, succeeded, failed, skipped
  }

  public record Request(String targetId, String moduleId, Boolean confirmed) {}
}
