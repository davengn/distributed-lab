package com.distributedlab.labapi.controller;

import com.distributedlab.labapi.model.CircuitBreaker;
import com.distributedlab.labapi.model.CircuitBreaker.CircuitBreakerState;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller exposing the state of all managed Resilience4j circuit breakers.
 */
@RestController
@RequestMapping("/api/v1/circuit-breakers")
public class CircuitBreakerController {

  private static final Logger log =
      LoggerFactory.getLogger(CircuitBreakerController.class);

  private final CircuitBreakerRegistry circuitBreakerRegistry;

  public CircuitBreakerController(CircuitBreakerRegistry circuitBreakerRegistry) {
    this.circuitBreakerRegistry = circuitBreakerRegistry;
  }

  @GetMapping
  public ResponseEntity<List<CircuitBreaker>> listCircuitBreakers() {
    List<CircuitBreaker> breakers =
        circuitBreakerRegistry.getAllCircuitBreakers().stream()
            .map(this::toModel)
            .collect(Collectors.toList());

    log.debug("Listing {} circuit breakers", breakers.size());
    return ResponseEntity.ok(breakers);
  }

  private CircuitBreaker toModel(
      io.github.resilience4j.circuitbreaker.CircuitBreaker cb) {
    var metrics = cb.getMetrics();
    var state = cb.getState();

    return new CircuitBreaker(
        cb.getName(),
        cb.getName(),
        mapState(state),
        cb.getCircuitBreakerConfig().getFailureRateThreshold(),
        (int) metrics.getNumberOfFailedCalls(),
        100.0 - metrics.getFailureRate(),
        metrics.getSlowCallRate(),
        Instant.now());
  }

  private CircuitBreakerState mapState(
      io.github.resilience4j.circuitbreaker.CircuitBreaker.State state) {
    return switch (state) {
      case CLOSED -> CircuitBreakerState.closed;
      case OPEN -> CircuitBreakerState.open;
      case HALF_OPEN -> CircuitBreakerState.half_open;
      case FORCED_OPEN -> CircuitBreakerState.open;
      case DISABLED -> CircuitBreakerState.closed;
      default -> CircuitBreakerState.closed;
    };
  }
}
