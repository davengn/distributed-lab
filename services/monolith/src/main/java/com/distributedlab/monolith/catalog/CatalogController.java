package com.distributedlab.monolith.catalog;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

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
  public CatalogItem getById(@PathVariable Long id) {
    log.info("Getting catalog item: {}", id);
    return repository.findById(id).orElseThrow();
  }
}
