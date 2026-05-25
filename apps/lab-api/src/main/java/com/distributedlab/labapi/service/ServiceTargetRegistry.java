package com.distributedlab.labapi.service;

import com.distributedlab.labapi.client.LabDockerClient;
import com.distributedlab.labapi.model.ServiceInfo;
import com.distributedlab.labapi.model.ServiceRequestTarget;
import com.distributedlab.labapi.model.ServiceRequestTarget.TargetStatus;
import java.net.URI;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class ServiceTargetRegistry {

  private final LabDockerClient dockerClient;

  private static final Map<String, TargetDefinition> TARGETS = Map.of(
      "monolith",
      new TargetDefinition(
          "monolith",
          "Monolith",
          8080,
          List.of("migration", "workflow", "observability"),
          List.of("GET", "POST", "PUT", "DELETE"),
          "/actuator/health"),
      "catalog-service",
      new TargetDefinition(
          "catalog-service",
          "Catalog Service",
          8081,
          List.of("migration", "workflow", "observability"),
          List.of("GET"),
          "/actuator/health"),
      "order-service",
      new TargetDefinition(
          "order-service",
          "Order Service",
          8082,
          List.of("workflow", "resiliency", "observability"),
          List.of("GET", "POST", "PUT"),
          "/actuator/health"),
      "payment-service",
      new TargetDefinition(
          "payment-service",
          "Payment Service",
          8083,
          List.of("workflow", "resiliency", "observability"),
          List.of("GET", "POST"),
          "/actuator/health"),
      "kv-store",
      new TargetDefinition(
          "kv-store",
          "KV Store",
          8090,
          List.of("consistency", "resiliency"),
          List.of("GET", "PUT"),
          "/actuator/health"));

  public ServiceTargetRegistry(LabDockerClient dockerClient) {
    this.dockerClient = dockerClient;
  }

  public List<ServiceRequestTarget> listTargets() {
    List<ServiceInfo> services = dockerClient.listServices();
    return TARGETS.values().stream()
        .map(definition -> toTarget(definition, services))
        .sorted(Comparator.comparing(ServiceRequestTarget::name))
        .toList();
  }

  public Optional<ResolvedServiceTarget> resolve(String targetId) {
    TargetDefinition definition = TARGETS.get(normalize(targetId));
    if (definition == null) {
      return Optional.empty();
    }

    ServiceRequestTarget target = toTarget(definition, dockerClient.listServices());
    URI baseUri = URI.create("http://" + definition.id() + ":" + definition.port());
    return Optional.of(new ResolvedServiceTarget(target, baseUri));
  }

  private ServiceRequestTarget toTarget(
      TargetDefinition definition, List<ServiceInfo> services) {
    Optional<ServiceInfo> service = services.stream()
        .filter(info -> matchesServiceName(info.name(), definition.id()))
        .findFirst();

    TargetStatus status = service
        .map(ServiceTargetRegistry::toTargetStatus)
        .orElse(TargetStatus.unavailable);
    Instant observedAt = service.map(ServiceInfo::lastHealthCheck).orElse(Instant.now());

    return new ServiceRequestTarget(
        definition.id(),
        definition.name(),
        status,
        definition.moduleIds(),
        definition.allowedMethods(),
        definition.healthPath(),
        observedAt);
  }

  private static TargetStatus toTargetStatus(ServiceInfo service) {
    return switch (service.status()) {
      case running -> TargetStatus.ready;
      case degraded -> TargetStatus.degraded;
      case stopped -> TargetStatus.unavailable;
      case unknown -> TargetStatus.unknown;
    };
  }

  private static boolean matchesServiceName(String serviceName, String targetId) {
    String normalizedName = normalize(serviceName);
    String normalizedTarget = normalize(targetId);
    return normalizedName.equals(normalizedTarget)
        || normalizedName.contains(normalizedTarget);
  }

  private static String normalize(String value) {
    return value == null ? "" : value.toLowerCase(Locale.ROOT).trim();
  }

  private record TargetDefinition(
      String id,
      String name,
      int port,
      List<String> moduleIds,
      List<String> allowedMethods,
      String healthPath) {}

  public record ResolvedServiceTarget(ServiceRequestTarget target, URI baseUri) {}
}
