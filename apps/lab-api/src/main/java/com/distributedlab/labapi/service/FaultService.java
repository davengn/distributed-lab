package com.distributedlab.labapi.service;

import com.distributedlab.labapi.client.LabToxiproxyClient;
import com.distributedlab.labapi.model.Fault;
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Service layer for fault injection lifecycle management. Delegates network-level
 * fault injection to {@link LabToxiproxyClient} and tracks active faults in memory.
 */
@Service
public class FaultService {

  private static final Logger log = LoggerFactory.getLogger(FaultService.class);

  private final LabToxiproxyClient toxiproxyClient;
  private final SimpMessagingTemplate messagingTemplate;
  private final Map<String, Fault> activeFaults = new ConcurrentHashMap<>();

  public FaultService(
      LabToxiproxyClient toxiproxyClient, SimpMessagingTemplate messagingTemplate) {
    this.toxiproxyClient = toxiproxyClient;
    this.messagingTemplate = messagingTemplate;
  }

  /**
   * Injects a latency fault targeting the given upstream service.
   *
   * @param targetService the upstream address (e.g. "order-service:8080")
   * @param latencyMs     latency in milliseconds to add
   * @param durationSeconds how long the fault should remain active
   * @return the created {@link Fault}
   */
  public Fault injectLatency(String targetService, long latencyMs, int durationSeconds) {
    String id = nextFaultId();
    try {
      String toxiproxyId = toxiproxyClient.injectLatency(targetService, latencyMs);
      Fault fault =
          new Fault(
              id,
              Fault.FaultType.latency,
              targetService,
              latencyMs + "ms",
              durationSeconds,
              Fault.FaultStatus.active,
              toxiproxyId,
              Instant.now());
      activeFaults.put(id, fault);
      broadcastFaultEvent("FAULT_INJECTED", fault);
      log.info("Injected latency fault {} ({}ms) on {}", id, latencyMs, targetService);
      return fault;
    } catch (IOException e) {
      log.error("Failed to inject latency fault on {}: {}", targetService, e.getMessage());
      throw new FaultInjectionException("Toxiproxy unavailable: " + e.getMessage(), e);
    }
  }

  /**
   * Injects a packet loss fault targeting the given upstream service.
   *
   * @param targetService the upstream address
   * @param percentage    packet loss percentage (0-100)
   * @param durationSeconds how long the fault should remain active
   * @return the created {@link Fault}
   */
  public Fault injectPacketLoss(
      String targetService, float percentage, int durationSeconds) {
    String id = nextFaultId();
    try {
      String toxiproxyId = toxiproxyClient.injectPacketLoss(targetService, percentage);
      Fault fault =
          new Fault(
              id,
              Fault.FaultType.packet_loss,
              targetService,
              percentage + "%",
              durationSeconds,
              Fault.FaultStatus.active,
              toxiproxyId,
              Instant.now());
      activeFaults.put(id, fault);
      broadcastFaultEvent("FAULT_INJECTED", fault);
      log.info(
          "Injected packet_loss fault {} ({}%) on {}", id, percentage, targetService);
      return fault;
    } catch (IOException e) {
      log.error(
          "Failed to inject packet_loss fault on {}: {}", targetService, e.getMessage());
      throw new FaultInjectionException("Toxiproxy unavailable: " + e.getMessage(), e);
    }
  }

  /**
   * Removes an active fault by its id, cleaning up the Toxiproxy proxy.
   *
   * @param id the fault identifier
   * @return the removed fault, or null if not found
   */
  public Fault removeFault(String id) {
    Fault fault = activeFaults.remove(id);
    if (fault == null) {
      return null;
    }
    try {
      toxiproxyClient.removeFault(fault.toxiproxyId());
    } catch (IOException e) {
      log.warn(
          "Failed to remove Toxiproxy proxy for fault {}: {}", id, e.getMessage());
    }
    broadcastFaultEvent("FAULT_REMOVED", fault);
    log.info("Removed fault: {}", id);
    return fault;
  }

  /** Returns all currently active faults. */
  public List<Fault> listFaults() {
    return new ArrayList<>(activeFaults.values());
  }

  /** Returns a fault by id, or null if not found. */
  public Fault getFault(String id) {
    return activeFaults.get(id);
  }

  private String nextFaultId() {
    return "FLT-" + String.format("%03d", activeFaults.size() + 1);
  }

  private void broadcastFaultEvent(String eventType, Fault fault) {
    messagingTemplate.convertAndSend(
        "/topic/faults",
        Map.of(
            "type",
            eventType,
            "payload",
            Map.of(
                "id",
                fault.id(),
                "type",
                fault.type().name(),
                "targetService",
                fault.targetService(),
                "magnitude",
                fault.magnitude(),
                "timestamp",
                Instant.now().toString())));
  }

  /** Runtime exception thrown when Toxiproxy is unavailable or the fault cannot be
   *  injected. */
  public static class FaultInjectionException extends RuntimeException {
    public FaultInjectionException(String message, Throwable cause) {
      super(message, cause);
    }
  }
}
