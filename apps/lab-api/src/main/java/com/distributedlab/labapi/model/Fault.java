package com.distributedlab.labapi.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record Fault(
    String id,
    FaultType type,
    String targetService,
    String magnitude,
    int durationSeconds,
    FaultStatus status,
    String toxiproxyId,
    Instant injectedAt) {

  public enum FaultType {
    latency, packet_loss, kill, memory, partition
  }

  public enum FaultStatus {
    active, stopped, expired
  }
}
