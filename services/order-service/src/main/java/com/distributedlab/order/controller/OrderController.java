package com.distributedlab.order.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

  private static final Logger log = LoggerFactory.getLogger(OrderController.class);
  private static final String TOPIC = "order-events";

  private final KafkaTemplate<String, String> kafkaTemplate;
  private final ObjectMapper objectMapper;
  private final Map<String, Map<String, Object>> orders = new ConcurrentHashMap<>();
  private final AtomicLong idCounter = new AtomicLong(1);

  public OrderController(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
    this.kafkaTemplate = kafkaTemplate;
    this.objectMapper = objectMapper;
  }

  @PostMapping
  public ResponseEntity<Map<String, Object>> createOrder(
      @RequestBody Map<String, Object> request) {
    String orderId = "ORD-" + String.format("%04d", idCounter.getAndIncrement());
    Map<String, Object> order = new ConcurrentHashMap<>();
    order.put("orderId", orderId);
    order.put("items", request.getOrDefault("items", List.of()));
    order.put("totalAmount", request.getOrDefault("totalAmount", 0));
    order.put("status", "CREATED");
    order.put("createdAt", Instant.now().toString());

    orders.put(orderId, order);

    try {
      String payload = objectMapper.writeValueAsString(Map.of(
          "eventType", "ORDER_CREATED",
          "orderId", orderId,
          "totalAmount", order.get("totalAmount"),
          "timestamp", Instant.now().toString()
      ));
      kafkaTemplate.send(TOPIC, orderId, payload);
      log.info("Published order event for orderId={}", orderId);
    } catch (Exception e) {
      log.error("Failed to publish order event for orderId={}", orderId, e);
    }

    return ResponseEntity.status(201).body(order);
  }

  @GetMapping
  public ResponseEntity<List<Map<String, Object>>> listOrders() {
    return ResponseEntity.ok(new ArrayList<>(orders.values()));
  }

  @GetMapping("/{orderId}")
  public ResponseEntity<Map<String, Object>> getOrder(@PathVariable String orderId) {
    Map<String, Object> order = orders.get(orderId);
    if (order == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(order);
  }

  @PutMapping("/{orderId}/status")
  public ResponseEntity<Map<String, Object>> updateStatus(
      @PathVariable String orderId, @RequestBody Map<String, String> body) {
    Map<String, Object> order = orders.get(orderId);
    if (order == null) {
      return ResponseEntity.notFound().build();
    }
    order.put("status", body.getOrDefault("status", "UNKNOWN"));
    return ResponseEntity.ok(order);
  }
}
