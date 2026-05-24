package com.distributedlab.labapi.controller;

import com.distributedlab.labapi.client.LabToxiproxyClient;
import com.distributedlab.labapi.model.Fault;
import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/faults")
public class FaultController {

  private static final Logger log = LoggerFactory.getLogger(FaultController.class);
  private final Map<String, Fault> activeFaults = new ConcurrentHashMap<>();

  private final LabToxiproxyClient toxiproxyClient;
  private final SimpMessagingTemplate messagingTemplate;

  public FaultController(LabToxiproxyClient toxiproxyClient, SimpMessagingTemplate messagingTemplate) {
    this.toxiproxyClient = toxiproxyClient;
    this.messagingTemplate = messagingTemplate;
  }

  @GetMapping
  public ResponseEntity<List<Fault>> listFaults() {
    return ResponseEntity.ok(new ArrayList<>(activeFaults.values()));
  }

  @PostMapping
  public ResponseEntity<?> injectFault(@RequestBody Map<String, Object> request) {
    String id = "FLT-" + String.format("%03d", activeFaults.size() + 1);
    String type = (String) request.get("type");
    String targetService = (String) request.get("targetService");
    String magnitude = (String) request.get("magnitude");
    int durationSeconds = request.containsKey("durationSeconds")
        ? ((Number) request.get("durationSeconds")).intValue() : 60;

    try {
      String toxiproxyId = switch (type) {
        case "latency" -> toxiproxyClient.injectLatency(targetService + ":8080", parseMagnitudeMs(magnitude));
        case "packet_loss" -> toxiproxyClient.injectPacketLoss(targetService + ":8080", parseMagnitudePercent(magnitude));
        default -> throw new IllegalArgumentException("Unsupported fault type: " + type);
      };

      Fault fault = new Fault(
          id, Fault.FaultType.valueOf(type), targetService, magnitude,
          durationSeconds, Fault.FaultStatus.active, toxiproxyId, Instant.now());
      activeFaults.put(id, fault);

      messagingTemplate.convertAndSend("/topic/faults", Map.of(
          "type", "FAULT_INJECTED",
          "payload", Map.of("id", id, "type", type, "targetService", targetService,
              "magnitude", magnitude, "timestamp", Instant.now().toString())
      ));

      log.info("Injected fault {}: {} {} on {}", id, type, magnitude, targetService);
      return ResponseEntity.status(201).body(fault);
    } catch (IOException e) {
      log.error("Failed to inject fault", e);
      return ResponseEntity.status(503).body(Map.of(
          "error", "Toxiproxy unavailable", "details", e.getMessage()));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(Map.of(
          "error", "Invalid fault parameters", "details", e.getMessage()));
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> removeFault(@PathVariable String id) {
    Fault fault = activeFaults.remove(id);
    if (fault == null) {
      return ResponseEntity.notFound().build();
    }
    try {
      toxiproxyClient.removeFault(fault.toxiproxyId());
    } catch (IOException e) {
      log.warn("Failed to remove Toxiproxy proxy: {}", fault.toxiproxyId());
    }

    messagingTemplate.convertAndSend("/topic/faults", Map.of(
        "type", "FAULT_REMOVED",
        "payload", Map.of("id", id, "timestamp", Instant.now().toString())
    ));

    log.info("Removed fault: {}", id);
    return ResponseEntity.noContent().build();
  }

  private long parseMagnitudeMs(String magnitude) {
    return Long.parseLong(magnitude.replaceAll("[^0-9]", ""));
  }

  private float parseMagnitudePercent(String magnitude) {
    return Float.parseFloat(magnitude.replaceAll("[^0-9.]", ""));
  }
}
