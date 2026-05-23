package com.distributedlab.monolith.payment;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

  private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

  private final PaymentRepository repository;

  public PaymentController(PaymentRepository repository) {
    this.repository = repository;
  }

  @GetMapping
  public List<Payment> listAll() {
    log.info("Listing all payments");
    return repository.findAll();
  }

  @PostMapping
  public Payment create(@RequestBody Map<String, Object> request) {
    Long orderId = Long.valueOf(request.get("orderId").toString());
    BigDecimal amount = new BigDecimal(request.get("amount").toString());
    String method = (String) request.getOrDefault("method", "CREDIT_CARD");
    log.info("Creating payment for order: {}", orderId);

    Payment payment = new Payment(orderId, amount, method);
    payment.complete("TXN-" + UUID.randomUUID().toString().substring(0, 8));
    return repository.save(payment);
  }
}
