package com.distributedlab.payment.consumer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class PaymentEventConsumer {

  private static final Logger log = LoggerFactory.getLogger(PaymentEventConsumer.class);
  private final ObjectMapper objectMapper;

  public PaymentEventConsumer(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  @KafkaListener(topics = "payment-events", groupId = "payment-service-group")
  public void consume(String message) {
    try {
      JsonNode node = objectMapper.readTree(message);
      String eventType = node.path("eventType").asText();
      String paymentId = node.path("paymentId").asText();
      log.info(
          "Received payment event: eventType={}, paymentId={}, payload={}",
          eventType, paymentId, message);
    } catch (Exception e) {
      log.error("Failed to parse payment event: {}", message, e);
    }
  }
}
