package com.distributedlab.labapi.service;

import com.distributedlab.labapi.model.ServiceRequestTarget;
import com.distributedlab.labapi.model.TestingUtilityRun;
import com.distributedlab.labapi.model.TestingUtilityRun.UtilityStatus;
import java.time.Duration;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class TestingUtilityService {

  private final ServiceTargetRegistry targetRegistry;

  public TestingUtilityService(ServiceTargetRegistry targetRegistry) {
    this.targetRegistry = targetRegistry;
  }

  public TestingUtilityRun run(String utilityId, TestingUtilityRun.Request request) {
    Instant startedAt = Instant.now();
    UtilityDefinition utility = findUtility(utilityId);
    if (utility == null) {
      throw new UtilityNotFoundException(utilityId);
    }
    if (utility.stateChanging() && !Boolean.TRUE.equals(request.confirmed())) {
      throw new ConfirmationRequiredException(utilityId);
    }

    List<ServiceRequestTarget> targets = targetRegistry.listTargets();
    Map<String, Object> details = new LinkedHashMap<>();
    if ("service-health-check".equals(utilityId)) {
      targets.stream()
          .filter(target -> request.targetId() == null
              || request.targetId().isBlank()
              || target.id().equals(request.targetId()))
          .forEach(target -> details.put(target.id(), target.status().name()));
      return result(
          utilityId,
          UtilityStatus.succeeded,
          "Service health check completed.",
          details,
          startedAt);
    }
    if ("sample-data-helper".equals(utilityId)) {
      details.put("moduleId", request.moduleId());
      details.put("sample", Map.of("path", "/api/catalog", "method", "GET"));
      return result(
          utilityId,
          UtilityStatus.succeeded,
          "Sample request data is ready for the selected lab.",
          details,
          startedAt);
    }
    if ("cleanup-reminder".equals(utilityId)) {
      details.put("moduleId", request.moduleId());
      return result(
          utilityId,
          UtilityStatus.skipped,
          "Restore toggles, routes, partitions, and injected faults before changing labs.",
          details,
          startedAt);
    }

    details.put("moduleId", request.moduleId());
    details.put("targetId", request.targetId());
    return result(
        utilityId,
        UtilityStatus.succeeded,
        "Safe reset confirmed. Re-run health checks before continuing the lab.",
        details,
        startedAt);
  }

  private static TestingUtilityRun result(
      String utilityId,
      UtilityStatus status,
      String message,
      Map<String, Object> details,
      Instant startedAt) {
    Instant completedAt = Instant.now();
    return new TestingUtilityRun(
        utilityId,
        status,
        message,
        details,
        Duration.between(startedAt, completedAt).toMillis(),
        completedAt);
  }

  private static UtilityDefinition findUtility(String utilityId) {
    return utilities().stream()
        .filter(utility -> utility.id().equals(utilityId))
        .findFirst()
        .orElse(null);
  }

  private static List<UtilityDefinition> utilities() {
    return List.of(
        new UtilityDefinition("service-health-check", false),
        new UtilityDefinition("sample-data-helper", false),
        new UtilityDefinition("cleanup-reminder", false),
        new UtilityDefinition("safe-reset", true));
  }

  private record UtilityDefinition(String id, boolean stateChanging) {}

  public static class UtilityNotFoundException extends RuntimeException {
    public UtilityNotFoundException(String utilityId) {
      super("Unknown testing utility: " + utilityId);
    }
  }

  public static class ConfirmationRequiredException extends RuntimeException {
    public ConfirmationRequiredException(String utilityId) {
      super("Utility requires confirmation: " + utilityId);
    }
  }
}
