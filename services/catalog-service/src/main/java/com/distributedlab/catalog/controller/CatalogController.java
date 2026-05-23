package com.distributedlab.catalog.controller;

import com.distributedlab.catalog.model.CatalogItem;
import com.distributedlab.catalog.repository.CatalogRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

  private static final Logger log = LoggerFactory.getLogger(CatalogController.class);

  private final CatalogRepository repository;

  public CatalogController(CatalogRepository repository) {
    this.repository = repository;
  }

  @GetMapping
  public List<CatalogItem> listAll() {
    log.info("Listing all catalog items");
    return repository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<CatalogItem> getById(@PathVariable Long id) {
    log.info("Getting catalog item: {}", id);
    return repository
        .findById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }
}
