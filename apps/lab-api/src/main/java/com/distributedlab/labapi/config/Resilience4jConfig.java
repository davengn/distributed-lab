package com.distributedlab.labapi.config;

import io.github.resilience4j.bulkhead.Bulkhead;
import io.github.resilience4j.bulkhead.BulkheadConfig;
import io.github.resilience4j.bulkhead.BulkheadRegistry;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import java.time.Duration;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Programmatic configuration of Resilience4j circuit breakers and bulkheads for the
 * lab microservices.
 */
@Configuration
public class Resilience4jConfig {

  private static final Logger log = LoggerFactory.getLogger(Resilience4jConfig.class);

  private static final List<String> MANAGED_SERVICES =
      List.of("payment-service", "order-service", "catalog-service");

  private static final float FAILURE_RATE_THRESHOLD = 50.0f;
  private static final Duration WAIT_DURATION_IN_OPEN_STATE = Duration.ofSeconds(60);
  private static final int SLIDING_WINDOW_SIZE = 10;
  private static final int MAX_CONCURRENT_CALLS = 5;

  @Bean
  public CircuitBreakerRegistry circuitBreakerRegistry() {
    CircuitBreakerConfig cbConfig =
        CircuitBreakerConfig.custom()
            .failureRateThreshold(FAILURE_RATE_THRESHOLD)
            .waitDurationInOpenState(WAIT_DURATION_IN_OPEN_STATE)
            .slidingWindowSize(SLIDING_WINDOW_SIZE)
            .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.COUNT_BASED)
            .build();

    CircuitBreakerRegistry registry = CircuitBreakerRegistry.of(cbConfig);

    for (String serviceName : MANAGED_SERVICES) {
      CircuitBreaker cb = registry.circuitBreaker(serviceName, cbConfig);
      log.info(
          "Registered circuit breaker for {}: failureRateThreshold={}%, "
              + "waitDuration={}s, slidingWindowSize={}",
          serviceName,
          FAILURE_RATE_THRESHOLD,
          WAIT_DURATION_IN_OPEN_STATE.getSeconds(),
          SLIDING_WINDOW_SIZE);

      cb.getEventPublisher()
          .onStateTransition(
              event ->
                  log.info(
                      "Circuit breaker '{}' transitioned from {} to {}",
                      event.getCircuitBreakerName(),
                      event.getStateTransition().getFromState(),
                      event.getStateTransition().getToState()));
    }

    return registry;
  }

  @Bean
  public BulkheadRegistry bulkheadRegistry() {
    BulkheadConfig bhConfig =
        BulkheadConfig.custom().maxConcurrentCalls(MAX_CONCURRENT_CALLS).build();

    BulkheadRegistry registry = BulkheadRegistry.of(bhConfig);

    for (String serviceName : MANAGED_SERVICES) {
      Bulkhead bh = registry.bulkhead(serviceName, bhConfig);
      log.info(
          "Registered bulkhead for {}: maxConcurrentCalls={}",
          serviceName,
          MAX_CONCURRENT_CALLS);

      bh.getEventPublisher()
          .onCallRejected(
              event ->
                  log.warn(
                      "Bulkhead '{}' rejected a call (concurrent limit reached)",
                      event.getBulkheadName()));
    }

    return registry;
  }
}
