package com.distributedlab.labapi.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ServiceInfo(
    String id,
    String name,
    ServiceType type,
    ServiceStatus status,
    String version,
    int port,
    String image,
    double cpuPercent,
    double memoryPercent,
    int memoryLimitMB,
    List<String> dependencies,
    String healthEndpoint,
    Instant lastHealthCheck) {

  public enum ServiceType {
    application, infrastructure, observability
  }

  public enum ServiceStatus {
    running, degraded, stopped, unknown
  }
}
