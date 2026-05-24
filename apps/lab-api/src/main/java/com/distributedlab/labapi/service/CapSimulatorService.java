package com.distributedlab.labapi.service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CapSimulatorService {

  private static final Logger log = LoggerFactory.getLogger(CapSimulatorService.class);

  private static final String NODE_A_URL = "http://kv-store-a:8090/api/kv";
  private static final String NODE_B_URL = "http://kv-store-b:8090/api/kv";

  private final RestTemplate restTemplate;

  private volatile boolean partitioned = false;
  private volatile Instant partitionSince = null;

  public CapSimulatorService() {
    this.restTemplate = new RestTemplate();
  }

  public Map<String, Object> simulatePartition() {
    log.info("Simulating network partition between kv-store nodes");
    this.partitioned = true;
    this.partitionSince = Instant.now();

    try {
      restTemplate.put(
          NODE_A_URL + "/partition/simulate",
          Map.of("enabled", true));
    } catch (Exception e) {
      log.warn("Could not reach node A for partition simulation: {}", e.getMessage());
    }

    try {
      restTemplate.put(
          NODE_B_URL + "/partition/simulate",
          Map.of("enabled", true));
    } catch (Exception e) {
      log.warn("Could not reach node B for partition simulation: {}", e.getMessage());
    }

    return getPartitionState();
  }

  public Map<String, Object> healPartition() {
    log.info("Healing network partition between kv-store nodes");
    this.partitioned = false;
    this.partitionSince = null;

    try {
      restTemplate.put(
          NODE_A_URL + "/partition/simulate",
          Map.of("enabled", false));
    } catch (Exception e) {
      log.warn("Could not reach node A for partition healing: {}", e.getMessage());
    }

    try {
      restTemplate.put(
          NODE_B_URL + "/partition/simulate",
          Map.of("enabled", false));
    } catch (Exception e) {
      log.warn("Could not reach node B for partition healing: {}", e.getMessage());
    }

    return getPartitionState();
  }

  @SuppressWarnings("unchecked")
  public Map<String, Object> getPartitionState() {
    Map<String, Object> state = new HashMap<>();
    state.put("partitioned", partitioned);
    state.put("since", partitionSince != null ? partitionSince.toString() : null);
    state.put("durationMs",
        partitioned && partitionSince != null
            ? Instant.now().toEpochMilli() - partitionSince.toEpochMilli()
            : 0L);

    try {
      ResponseEntity<Map<String, Object>> response =
          (ResponseEntity<Map<String, Object>>) (ResponseEntity<?>) restTemplate.getForEntity(
              NODE_A_URL + "/dump", Map.class);
      state.put("nodeA", response.getBody());
    } catch (Exception e) {
      state.put("nodeA", Map.of("error", e.getMessage()));
    }

    try {
      ResponseEntity<Map<String, Object>> response =
          (ResponseEntity<Map<String, Object>>) (ResponseEntity<?>) restTemplate.getForEntity(
              NODE_B_URL + "/dump", Map.class);
      state.put("nodeB", response.getBody());
    } catch (Exception e) {
      state.put("nodeB", Map.of("error", e.getMessage()));
    }

    boolean diverged = checkDivergence(state);
    state.put("diverged", diverged);

    return state;
  }

  @SuppressWarnings("unchecked")
  private boolean checkDivergence(Map<String, Object> state) {
    try {
      Map<String, Object> nodeA = (Map<String, Object>) state.get("nodeA");
      Map<String, Object> nodeB = (Map<String, Object>) state.get("nodeB");
      if (nodeA == null || nodeB == null) {
        return false;
      }
      Map<String, Object> storeA = (Map<String, Object>) nodeA.get("store");
      Map<String, Object> storeB = (Map<String, Object>) nodeB.get("store");
      if (storeA == null || storeB == null) {
        return false;
      }
      return !storeA.equals(storeB);
    } catch (Exception e) {
      log.warn("Could not check divergence: {}", e.getMessage());
      return false;
    }
  }

  @SuppressWarnings("unchecked")
  public Map<String, Object> writeKey(String node, String key, String value) {
    String url = "a".equalsIgnoreCase(node) ? NODE_A_URL : NODE_B_URL;
    Map<String, Object> body = Map.of("value", value);
    try {
      ResponseEntity<Map<String, Object>> response =
          (ResponseEntity<Map<String, Object>>) (ResponseEntity<?>) restTemplate.postForEntity(
              url + "/" + key, body, Map.class);
      return response.getBody();
    } catch (Exception e) {
      log.error("Failed to write key {} to node {}: {}", key, node, e.getMessage());
      return Map.of("error", e.getMessage());
    }
  }

  @SuppressWarnings("unchecked")
  public Map<String, Object> readKey(String node, String key) {
    String url = "a".equalsIgnoreCase(node) ? NODE_A_URL : NODE_B_URL;
    try {
      ResponseEntity<Map<String, Object>> response =
          (ResponseEntity<Map<String, Object>>) (ResponseEntity<?>) restTemplate.getForEntity(
              url + "/" + key, Map.class);
      return response.getBody();
    } catch (Exception e) {
      log.error("Failed to read key {} from node {}: {}", key, node, e.getMessage());
      return Map.of("error", e.getMessage());
    }
  }
}
