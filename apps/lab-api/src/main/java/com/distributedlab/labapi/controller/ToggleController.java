package com.distributedlab.labapi.controller;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/toggles")
public class ToggleController {

  private static final Logger log = LoggerFactory.getLogger(ToggleController.class);
  private static final String TOGGLE_PREFIX = "toggle:";

  private final StringRedisTemplate redisTemplate;
  private final SimpMessagingTemplate messagingTemplate;

  public ToggleController(StringRedisTemplate redisTemplate, SimpMessagingTemplate messagingTemplate) {
    this.redisTemplate = redisTemplate;
    this.messagingTemplate = messagingTemplate;
  }

  @GetMapping
  public ResponseEntity<List<Map<String, Object>>> listToggles() {
    Set<String> keys = redisTemplate.keys(TOGGLE_PREFIX + "*");
    List<Map<String, Object>> toggles = new ArrayList<>();
    if (keys != null) {
      for (String key : keys) {
        String toggleKey = key.substring(TOGGLE_PREFIX.length());
        String value = redisTemplate.opsForValue().get(key);
        toggles.add(Map.of(
            "key", toggleKey,
            "enabled", Boolean.parseBoolean(value != null ? value : "false")
        ));
      }
    }
    return ResponseEntity.ok(toggles);
  }

  @PutMapping("/{key}")
  public ResponseEntity<Map<String, Object>> updateToggle(
      @PathVariable String key, @RequestBody Map<String, Object> request) {
    boolean enabled = Boolean.parseBoolean(request.get("enabled").toString());
    redisTemplate.opsForValue().set(TOGGLE_PREFIX + key, String.valueOf(enabled));

    log.info("Toggle {} set to {}", key, enabled);

    messagingTemplate.convertAndSend("/topic/events", Map.of(
        "type", "EVENT",
        "payload", Map.of(
            "severity", "info",
            "message", "Feature toggle '" + key + "' " + (enabled ? "enabled" : "disabled"),
            "timestamp", Instant.now().toString()
        )
    ));

    return ResponseEntity.ok(Map.of("key", key, "enabled", enabled));
  }
}
