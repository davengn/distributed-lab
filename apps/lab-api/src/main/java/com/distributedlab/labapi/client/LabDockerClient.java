package com.distributedlab.labapi.client;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.model.Container;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientConfig;
import com.github.dockerjava.core.DockerClientImpl;
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient;
import com.github.dockerjava.transport.DockerHttpClient;
import com.distributedlab.labapi.model.ServiceInfo;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class LabDockerClient {

  private static final Logger log = LoggerFactory.getLogger(LabDockerClient.class);

  private final DockerClient dockerClient;

  public LabDockerClient(@Value("${docker.socket}") String dockerSocket) {
    DockerClientConfig config =
        DefaultDockerClientConfig.createDefaultConfigBuilder()
            .withDockerHost(dockerSocket)
            .build();
    DockerHttpClient httpClient =
        new ApacheDockerHttpClient.Builder().dockerHost(config.getDockerHost()).build();
    this.dockerClient = DockerClientImpl.getInstance(config, httpClient);
    log.info("Docker client initialized with socket: {}", dockerSocket);
  }

  public List<ServiceInfo> listServices() {
    List<Container> containers =
        dockerClient
            .listContainersCmd()
            .withShowAll(true)
            .withLabelFilter(
                List.of("com.docker.compose.project=distributed-lab"))
            .exec();

    return containers.stream().map(this::toServiceInfo).collect(Collectors.toList());
  }

  public ServiceInfo getService(String name) {
    return listServices().stream()
        .filter(s -> s.name().equals(name))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("Service not found: " + name));
  }

  private ServiceInfo toServiceInfo(Container container) {
    String name =
        container.getNames().length > 0
            ? container.getNames()[0].replaceFirst("/", "")
            : "unknown";

    ServiceInfo.ServiceStatus status =
        "running".equals(container.getState())
            ? ServiceInfo.ServiceStatus.running
            : ServiceInfo.ServiceStatus.stopped;

    return new ServiceInfo(
        container.getId(),
        name,
        ServiceInfo.ServiceType.application,
        status,
        container.getImage(),
        container.getPorts().length > 0 ? container.getPorts()[0].getPublicPort() : 0,
        container.getImage(),
        0.0,
        0.0,
        0,
        List.of(),
        "/actuator/health",
        Instant.now());
  }
}
