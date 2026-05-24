package com.distributedlab.template;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class HealthController {

  private static final Logger log = LoggerFactory.getLogger(HealthController.class);

  @GetMapping("/api/health")
  public ResponseEntity<Map<String, Object>> health() {
    log.info("Health check requested");
    return ResponseEntity.ok(Map.of(
        "status", "UP",
        "service", "template-service",
        "timestamp", Instant.now().toString()
    ));
  }
}
