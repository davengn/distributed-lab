package com.distributedlab.labapi.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record Experiment(
    String id,
    ExperimentType type,
    int module,
    ExperimentStatus status,
    String targetService,
    Map<String, Object> configuration,
    Instant startedAt,
    Instant completedAt,
    Map<String, Object> result) {

  public enum ExperimentType {
    strangler_fig, parallel_run, cap_partition, replication_lag,
    chaos_injection, circuit_breaker, saga_orchestrated, saga_choreographed,
    idempotency_test, communication_comparison, cdc_pipeline
  }

  public enum ExperimentStatus {
    pending, running, completed, failed
  }
}
