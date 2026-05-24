package com.distributedlab.monolith.payment;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payments")
public class Payment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "order_id")
  private Long orderId;

  @Column(precision = 10, scale = 2)
  private BigDecimal amount;

  private String method;

  private String status;

  @Column(name = "transaction_ref")
  private String transactionRef;

  @Column(name = "created_at")
  private Instant createdAt;

  protected Payment() {}

  public Payment(Long orderId, BigDecimal amount, String method) {
    this.orderId = orderId;
    this.amount = amount;
    this.method = method;
    this.status = "PENDING";
    this.createdAt = Instant.now();
  }

  public Long getId() { return id; }
  public Long getOrderId() { return orderId; }
  public BigDecimal getAmount() { return amount; }
  public String getMethod() { return method; }
  public String getStatus() { return status; }
  public String getTransactionRef() { return transactionRef; }
  public void complete(String transactionRef) {
    this.status = "COMPLETED";
    this.transactionRef = transactionRef;
  }
}
