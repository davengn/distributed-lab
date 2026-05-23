package com.distributedlab.labapi.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record LabModule(
    int id,
    String name,
    String description,
    List<String> concepts,
    List<Feature> features,
    ModuleStatus status) {

  public record Feature(
      String name,
      String description,
      String serviceTarget) {}

  public enum ModuleStatus {
    locked, available, in_progress, completed
  }
}
