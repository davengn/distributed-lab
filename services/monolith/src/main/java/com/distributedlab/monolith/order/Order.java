package com.distributedlab.monolith.order;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "orders")
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "customer_email")
  private String customerEmail;

  private String status;

  @Column(name = "total_amount", precision = 10, scale = 2)
  private BigDecimal totalAmount;

  @Column(name = "created_at")
  private Instant createdAt;

  @Column(name = "updated_at")
  private Instant updatedAt;

  protected Order() {}

  public Order(String customerEmail, BigDecimal totalAmount) {
    this.customerEmail = customerEmail;
    this.status = "PENDING";
    this.totalAmount = totalAmount;
    this.createdAt = Instant.now();
  }

  public Long getId() { return id; }
  public String getCustomerEmail() { return customerEmail; }
  public String getStatus() { return status; }
  public BigDecimal getTotalAmount() { return totalAmount; }
  public Instant getCreatedAt() { return createdAt; }
  public void setStatus(String status) { this.status = status; this.updatedAt = Instant.now(); }
}
