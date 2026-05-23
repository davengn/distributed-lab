package com.distributedlab.kvstore.controller;

import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/kv")
public class KvStoreController {

  private static final Logger log = LoggerFactory.getLogger(KvStoreController.class);

  private final ConcurrentHashMap<String, StoredValue> store = new ConcurrentHashMap<>();

  private volatile boolean partitioned = false;
  private volatile Instant partitionSince = null;

  public KvStoreController() {
    store.put("demo-key", new StoredValue("hello-world", Instant.now()));
  }

  @GetMapping
  public ResponseEntity<List<String>> listKeys() {
    Set<String> keys = store.keySet();
    log.info("Listing {} keys", keys.size());
    return ResponseEntity.ok(keys.stream().sorted().toList());
  }

  @GetMapping("/{key}")
  public ResponseEntity<Map<String, Object>> get(@PathVariable String key) {
    StoredValue value = store.get(key);
    if (value == null) {
      log.warn("Key not found: {}", key);
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(Map.of("error", "Key not found", "key", key));
    }
    Map<String, Object> response = new HashMap<>();
    response.put("key", key);
    response.put("value", value.value());
    response.put("createdAt", value.createdAt().toString());
    response.put("partitioned", partitioned);
    log.info("Retrieved key: {} (partitioned={})", key, partitioned);
    return ResponseEntity.ok(response);
  }

  @PutMapping("/{key}")
  public ResponseEntity<Map<String, Object>> put(
      @PathVariable String key, @RequestBody Map<String, String> body) {
    String value = body.get("value");
    if (value == null) {
      return ResponseEntity.badRequest()
          .body(Map.of("error", "Request body must contain 'value' field"));
    }
    StoredValue previous = store.put(key, new StoredValue(value, Instant.now()));
    Map<String, Object> response = new HashMap<>();
    response.put("key", key);
    response.put("value", value);
    response.put("previousValue", previous != null ? previous.value() : null);
    response.put("partitioned", partitioned);
    log.info("Set key: {} (partitioned={})", key, partitioned);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/partition")
  public ResponseEntity<Map<String, Object>> getPartitionState() {
    Map<String, Object> state = new HashMap<>();
    state.put("partitioned", partitioned);
    state.put("since", partitionSince != null ? partitionSince.toString() : null);
    state.put("durationMs",
        partitioned && partitionSince != null
            ? Instant.now().toEpochMilli() - partitionSince.toEpochMilli()
            : 0);
    return ResponseEntity.ok(state);
  }

  @PutMapping("/partition/simulate")
  public ResponseEntity<Map<String, Object>> simulatePartition(
      @RequestBody Map<String, Boolean> body) {
    boolean enable = body.getOrDefault("enabled", true);
    this.partitioned = enable;
    this.partitionSince = enable ? Instant.now() : null;
    log.info("Partition simulation: {}", enable ? "ENABLED" : "DISABLED");
    Map<String, Object> response = new HashMap<>();
    response.put("partitioned", partitioned);
    response.put("since", partitionSince != null ? partitionSince.toString() : null);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/dump")
  public ResponseEntity<Map<String, Object>> dump() {
    Map<String, Object> snapshot = new HashMap<>();
    snapshot.put("store", Collections.unmodifiableMap(
        store.entrySet().stream()
            .collect(HashMap::new,
                (m, e) -> m.put(e.getKey(), Map.of(
                    "value", e.getValue().value(),
                    "createdAt", e.getValue().createdAt().toString())),
                HashMap::putAll)));
    snapshot.put("partitioned", partitioned);
    snapshot.put("size", store.size());
    return ResponseEntity.ok(snapshot);
  }

  private record StoredValue(String value, Instant createdAt) {}
}
