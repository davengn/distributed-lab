package com.distributedlab.labapi.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CircuitBreaker(
    String id,
    String serviceName,
    CircuitBreakerState state,
    double failureRateThreshold,
    int failureCount,
    double successRate,
    double slowCallRate,
    Instant stateChangedAt) {

  public enum CircuitBreakerState {
    closed, open, half_open
  }
}
