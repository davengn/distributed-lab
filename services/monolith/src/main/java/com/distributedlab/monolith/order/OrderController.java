package com.distributedlab.monolith.order;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

  private static final Logger log = LoggerFactory.getLogger(OrderController.class);

  private final OrderRepository repository;

  public OrderController(OrderRepository repository) {
    this.repository = repository;
  }

  @GetMapping
  public List<Order> listAll() {
    log.info("Listing all orders");
    return repository.findAll();
  }

  @GetMapping("/{id}")
  public Order getById(@PathVariable Long id) {
    log.info("Getting order: {}", id);
    return repository.findById(id).orElseThrow();
  }

  @PostMapping
  public Order create(@RequestBody Map<String, Object> request) {
    String email = (String) request.get("customerEmail");
    BigDecimal total = new BigDecimal(request.get("totalAmount").toString());
    log.info("Creating order for: {}", email);
    return repository.save(new Order(email, total));
  }
}
