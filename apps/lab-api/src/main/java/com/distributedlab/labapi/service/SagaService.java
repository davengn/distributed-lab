package com.distributedlab.labapi.service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SagaService {

  private static final Logger log = LoggerFactory.getLogger(SagaService.class);

  private final RestTemplate restTemplate;
  private final Map<String, Map<String, Object>> sagas = new ConcurrentHashMap<>();

  public SagaService(RestTemplate restTemplate) {
    this.restTemplate = restTemplate;
  }

  public Map<String, Object> startSaga(String type, String orderId, List<String> steps) {
    String sagaId = "SAGA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

    List<Map<String, Object>> stepStates = new ArrayList<>();
    for (String step : steps) {
      Map<String, Object> stepState = new LinkedHashMap<>();
      stepState.put("name", step);
      stepState.put("status", "pending");
      stepStates.add(stepState);
    }

    Map<String, Object> saga = new ConcurrentHashMap<>();
    saga.put("sagaId", sagaId);
    saga.put("type", type);
    saga.put("orderId", orderId);
    saga.put("status", "running");
    saga.put("steps", stepStates);
    saga.put("createdAt", Instant.now().toString());
    saga.put("updatedAt", Instant.now().toString());

    sagas.put(sagaId, saga);

    executeSagaSteps(sagaId, steps);

    return saga;
  }

  public Map<String, Object> getSaga(String sagaId) {
    Map<String, Object> saga = sagas.get(sagaId);
    if (saga == null) {
      return null;
    }
    return saga;
  }

  public List<Map<String, Object>> listSagas() {
    return new ArrayList<>(sagas.values());
  }

  @SuppressWarnings("unchecked")
  private void executeSagaSteps(String sagaId, List<String> steps) {
    Map<String, Object> saga = sagas.get(sagaId);
    List<Map<String, Object>> stepStates = (List<Map<String, Object>>) saga.get("steps");

    Thread.ofVirtual().start(() -> {
      for (int i = 0; i < stepStates.size(); i++) {
        Map<String, Object> stepState = stepStates.get(i);
        String stepName = (String) stepState.get("name");

        stepState.put("status", "running");
        stepState.put("startedAt", Instant.now().toString());
        saga.put("updatedAt", Instant.now().toString());

        try {
          executeStep(stepName, saga);
          stepState.put("status", "completed");
          stepState.put("completedAt", Instant.now().toString());
          log.info("Saga step completed: sagaId={}, step={}", sagaId, stepName);
        } catch (Exception e) {
          stepState.put("status", "failed");
          stepState.put("error", e.getMessage());
          stepState.put("completedAt", Instant.now().toString());
          saga.put("status", "failed");
          saga.put("updatedAt", Instant.now().toString());

          log.error("Saga step failed: sagaId={}, step={}", sagaId, stepName, e);

          compensate(sagaId, i);
          return;
        }

        saga.put("updatedAt", Instant.now().toString());
      }

      saga.put("status", "completed");
      saga.put("updatedAt", Instant.now().toString());
      log.info("Saga completed: sagaId={}", sagaId);
    });
  }

  private void executeStep(String stepName, Map<String, Object> saga) {
    String orderId = (String) saga.get("orderId");

    switch (stepName) {
      case "create-order" -> {
        String url = "http://order-service:8082/api/orders";
        Map<String, Object> body = Map.of(
            "orderId", orderId,
            "items", List.of("item-1"),
            "totalAmount", 100
        );
        restTemplate.postForEntity(url, body, Map.class);
      }
      case "process-payment" -> {
        String url = "http://payment-service:8083/api/payments";
        Map<String, Object> body = Map.of(
            "orderId", orderId,
            "amount", 100,
            "idempotencyKey", orderId + "-payment"
        );
        restTemplate.postForEntity(url, body, Map.class);
      }
      case "confirm-order" -> {
        String url = "http://order-service:8082/api/orders/" + orderId + "/status";
        Map<String, String> body = Map.of("status", "CONFIRMED");
        restTemplate.put(url, body, Map.class);
      }
      default -> log.warn("Unknown saga step: {}", stepName);
    }
  }

  @SuppressWarnings("unchecked")
  private void compensate(String sagaId, int failedIndex) {
    Map<String, Object> saga = sagas.get(sagaId);
    List<Map<String, Object>> stepStates = (List<Map<String, Object>>) saga.get("steps");
    saga.put("status", "compensating");

    for (int i = failedIndex - 1; i >= 0; i--) {
      Map<String, Object> stepState = stepStates.get(i);
      String stepName = (String) stepState.get("name");

      try {
        compensateStep(stepName, saga);
        stepState.put("status", "compensated");
        log.info("Saga compensation completed: sagaId={}, step={}", sagaId, stepName);
      } catch (Exception e) {
        stepState.put("status", "compensation-failed");
        log.error("Saga compensation failed: sagaId={}, step={}", sagaId, stepName, e);
      }
    }

    saga.put("status", "failed");
    saga.put("updatedAt", Instant.now().toString());
  }

  private void compensateStep(String stepName, Map<String, Object> saga) {
    String orderId = (String) saga.get("orderId");

    switch (stepName) {
      case "create-order" -> {
        String url = "http://order-service:8082/api/orders/" + orderId + "/status";
        restTemplate.put(url, Map.of("status", "CANCELLED"), Map.class);
      }
      case "process-payment" -> {
        log.info("Payment refund initiated for orderId={}", orderId);
      }
      default -> log.warn("No compensation for step: {}", stepName);
    }
  }
}
