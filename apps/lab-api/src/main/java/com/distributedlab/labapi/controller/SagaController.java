package com.distributedlab.labapi.controller;

import com.distributedlab.labapi.service.SagaService;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sagas")
public class SagaController {

  private static final Logger log = LoggerFactory.getLogger(SagaController.class);

  private final SagaService sagaService;

  public SagaController(SagaService sagaService) {
    this.sagaService = sagaService;
  }

  @PostMapping("/start")
  public ResponseEntity<Map<String, Object>> startSaga(@RequestBody Map<String, Object> request) {
    String type = (String) request.getOrDefault("type", "order-payment");
    String orderId = (String) request.getOrDefault("orderId", "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

    @SuppressWarnings("unchecked")
    List<String> steps = (List<String>) request.getOrDefault("steps",
        List.of("create-order", "process-payment", "confirm-order"));

    log.info("Starting saga: type={}, orderId={}, steps={}", type, orderId, steps);
    Map<String, Object> saga = sagaService.startSaga(type, orderId, steps);

    return ResponseEntity.status(201).body(saga);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Map<String, Object>> getSaga(@PathVariable String id) {
    Map<String, Object> saga = sagaService.getSaga(id);
    if (saga == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(saga);
  }

  @GetMapping
  public ResponseEntity<List<Map<String, Object>>> listSagas() {
    return ResponseEntity.ok(sagaService.listSagas());
  }
}
