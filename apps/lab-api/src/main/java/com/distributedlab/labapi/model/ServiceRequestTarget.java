package com.distributedlab.labapi.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ServiceRequestTarget(
    String id,
    String name,
    TargetStatus status,
    List<String> moduleIds,
    List<String> allowedMethods,
    String healthPath,
    Instant lastObservedAt) {

  public enum TargetStatus {
    ready, degraded, unavailable, unknown
  }
}
