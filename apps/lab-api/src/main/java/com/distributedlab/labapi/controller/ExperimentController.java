package com.distributedlab.labapi.controller;

import com.distributedlab.labapi.model.Experiment;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/experiments")
public class ExperimentController {

  private static final Logger log = LoggerFactory.getLogger(ExperimentController.class);
  private final Map<String, Experiment> experiments = new ConcurrentHashMap<>();

  private final SimpMessagingTemplate messagingTemplate;

  public ExperimentController(SimpMessagingTemplate messagingTemplate) {
    this.messagingTemplate = messagingTemplate;
  }

  @GetMapping
  public ResponseEntity<List<Experiment>> listExperiments() {
    return ResponseEntity.ok(new ArrayList<>(experiments.values()));
  }

  @GetMapping("/{id}")
  public ResponseEntity<Experiment> getExperiment(@PathVariable String id) {
    Experiment experiment = experiments.get(id);
    if (experiment == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(experiment);
  }

  @PostMapping
  public ResponseEntity<?> createExperiment(@RequestBody Map<String, Object> request) {
    String id = "EXP-" + String.format("%03d", experiments.size() + 1);
    String type = (String) request.get("type");
    String targetService = (String) request.get("targetService");

    @SuppressWarnings("unchecked")
    Map<String, Object> configuration = (Map<String, Object>) request.get("configuration");

    int module = switch (type) {
      case "strangler_fig", "parallel_run" -> 1;
      case "cap_partition", "replication_lag", "cdc_pipeline" -> 2;
      case "chaos_injection", "circuit_breaker" -> 3;
      case "saga_orchestrated", "saga_choreographed", "idempotency_test", "communication_comparison" -> 4;
      default -> 0;
    };

    Experiment experiment = new Experiment(
        id,
        Experiment.ExperimentType.valueOf(type),
        module,
        Experiment.ExperimentStatus.running,
        targetService,
        configuration,
        Instant.now(),
        null,
        null);

    experiments.put(id, experiment);

    messagingTemplate.convertAndSend("/topic/experiments", Map.of(
        "type", "EXPERIMENT_STARTED",
        "payload", Map.of("id", id, "type", type, "status", "running",
            "timestamp", Instant.now().toString())
    ));

    log.info("Created experiment {}: {} on {}", id, type, targetService);
    return ResponseEntity.status(201).body(experiment);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> stopExperiment(@PathVariable String id) {
    Experiment experiment = experiments.remove(id);
    if (experiment == null) {
      return ResponseEntity.notFound().build();
    }

    messagingTemplate.convertAndSend("/topic/experiments", Map.of(
        "type", "EXPERIMENT_COMPLETED",
        "payload", Map.of("id", id, "status", "completed",
            "timestamp", Instant.now().toString())
    ));

    log.info("Stopped experiment: {}", id);
    return ResponseEntity.noContent().build();
  }
}
