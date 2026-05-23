package com.distributedlab.monolith.catalog;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "catalog")
public class CatalogItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;
  private String artist;
  private String genre;

  @Column(name = "price", precision = 10, scale = 2)
  private BigDecimal price;

  @Column(name = "stock_quantity")
  private Integer stockQuantity;

  @Column(name = "created_at")
  private Instant createdAt;

  protected CatalogItem() {}

  public CatalogItem(String title, String artist, String genre, BigDecimal price, Integer stockQuantity) {
    this.title = title;
    this.artist = artist;
    this.genre = genre;
    this.price = price;
    this.stockQuantity = stockQuantity;
    this.createdAt = Instant.now();
  }

  public Long getId() { return id; }
  public String getTitle() { return title; }
  public String getArtist() { return artist; }
  public String getGenre() { return genre; }
  public BigDecimal getPrice() { return price; }
  public Integer getStockQuantity() { return stockQuantity; }
  public Instant getCreatedAt() { return createdAt; }
}
