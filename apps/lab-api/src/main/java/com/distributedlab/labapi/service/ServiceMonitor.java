package com.distributedlab.labapi.service;

import com.distributedlab.labapi.client.LabDockerClient;
import com.distributedlab.labapi.model.ServiceInfo;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class ServiceMonitor {

  private static final Logger log = LoggerFactory.getLogger(ServiceMonitor.class);

  private final LabDockerClient dockerClient;
  private final SimpMessagingTemplate messagingTemplate;

  public ServiceMonitor(LabDockerClient dockerClient, SimpMessagingTemplate messagingTemplate) {
    this.dockerClient = dockerClient;
    this.messagingTemplate = messagingTemplate;
  }

  @Scheduled(fixedRate = 5000)
  public void pollServiceMetrics() {
    try {
      List<ServiceInfo> services = dockerClient.listServices();
      for (ServiceInfo service : services) {
        messagingTemplate.convertAndSend("/topic/services", Map.of(
            "type", "SERVICE_UPDATE",
            "payload", Map.of(
                "name", service.name(),
                "status", service.status().name(),
                "cpuPercent", service.cpuPercent(),
                "memoryPercent", service.memoryPercent(),
                "timestamp", Instant.now().toString()
            )
        ));
      }
      messagingTemplate.convertAndSend("/topic/events", Map.of(
          "type", "EVENT",
          "payload", Map.of(
              "severity", "info",
              "message", String.format("Metrics polled for %d services", services.size()),
              "timestamp", Instant.now().toString()
          )
      ));
    } catch (Exception e) {
      log.error("Failed to poll service metrics: {}", e.getMessage());
    }
  }
}
