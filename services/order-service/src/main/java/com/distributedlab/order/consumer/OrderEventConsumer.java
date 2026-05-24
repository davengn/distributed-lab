package com.distributedlab.order.consumer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventConsumer {

  private static final Logger log = LoggerFactory.getLogger(OrderEventConsumer.class);
  private final ObjectMapper objectMapper;

  public OrderEventConsumer(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  @KafkaListener(topics = "order-events", groupId = "order-service-group")
  public void consume(String message) {
    try {
      JsonNode node = objectMapper.readTree(message);
      String eventType = node.path("eventType").asText();
      String orderId = node.path("orderId").asText();
      log.info(
          "Received order event: eventType={}, orderId={}, payload={}",
          eventType, orderId, message);
    } catch (Exception e) {
      log.error("Failed to parse order event: {}", message, e);
    }
  }
}
