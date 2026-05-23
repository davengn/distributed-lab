package com.distributedlab.labapi.controller;

import com.distributedlab.labapi.client.LabDockerClient;
import com.distributedlab.labapi.model.ServiceInfo;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/services")
public class ServiceController {

  private static final Logger log = LoggerFactory.getLogger(ServiceController.class);

  private final LabDockerClient dockerClient;

  public ServiceController(LabDockerClient dockerClient) {
    this.dockerClient = dockerClient;
  }

  @GetMapping
  public ResponseEntity<List<ServiceInfo>> listServices() {
    log.info("Listing all services");
    return ResponseEntity.ok(dockerClient.listServices());
  }

  @GetMapping("/{name}")
  public ResponseEntity<ServiceInfo> getService(@PathVariable String name) {
    log.info("Getting service: {}", name);
    try {
      return ResponseEntity.ok(dockerClient.getService(name));
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }
}
