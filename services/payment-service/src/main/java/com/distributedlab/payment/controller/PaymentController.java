package com.distributedlab.payment.controller;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

  private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

  private final Map<String, Map<String, Object>> processedPayments = new ConcurrentHashMap<>();
  private final Map<String, Map<String, Object>> idempotencyCache = new ConcurrentHashMap<>();
  private final AtomicLong idCounter = new AtomicLong(1);

  @PostMapping
  public ResponseEntity<Map<String, Object>> processPayment(
      @RequestBody Map<String, Object> request) {
    String idempotencyKey = (String) request.get("idempotencyKey");

    if (idempotencyKey != null && idempotencyCache.containsKey(idempotencyKey)) {
      log.info("Duplicate payment request detected for idempotencyKey={}", idempotencyKey);
      Map<String, Object> cached = idempotencyCache.get(idempotencyKey);
      cached.put("idempotent", true);
      return ResponseEntity.ok(cached);
    }

    String paymentId = "PAY-" + String.format("%04d", idCounter.getAndIncrement());
    Map<String, Object> payment = new ConcurrentHashMap<>();
    payment.put("paymentId", paymentId);
    payment.put("orderId", request.getOrDefault("orderId", ""));
    payment.put("amount", request.getOrDefault("amount", 0));
    payment.put("status", "PROCESSED");
    payment.put("idempotencyKey", idempotencyKey);
    payment.put("processedAt", Instant.now().toString());
    payment.put("idempotent", false);

    processedPayments.put(paymentId, payment);

    if (idempotencyKey != null) {
      idempotencyCache.put(idempotencyKey, new ConcurrentHashMap<>(payment));
    }

    log.info("Processed payment: paymentId={}, orderId={}, amount={}",
        paymentId, payment.get("orderId"), payment.get("amount"));

    return ResponseEntity.status(201).body(payment);
  }

  @GetMapping
  public ResponseEntity<List<Map<String, Object>>> listPayments() {
    return ResponseEntity.ok(new ArrayList<>(processedPayments.values()));
  }

  @GetMapping("/stats")
  public ResponseEntity<Map<String, Object>> getStats() {
    return ResponseEntity.ok(Map.of(
        "totalProcessed", processedPayments.size(),
        "uniqueIdempotencyKeys", idempotencyCache.size(),
        "duplicatesBlocked", processedPayments.size() - idempotencyCache.size()
    ));
  }
}
