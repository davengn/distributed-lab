package com.distributedlab.labapi.controller;

import com.distributedlab.labapi.model.ServiceRequest;
import com.distributedlab.labapi.model.ServiceRequestResult;
import com.distributedlab.labapi.model.ServiceRequestResult.ResultStatus;
import com.distributedlab.labapi.model.TestingUtilityRun;
import com.distributedlab.labapi.service.ServiceRequestRunner;
import com.distributedlab.labapi.service.ServiceTargetRegistry;
import com.distributedlab.labapi.service.TestingUtilityService;
import com.distributedlab.labapi.service.TestingUtilityService.ConfirmationRequiredException;
import com.distributedlab.labapi.service.TestingUtilityService.UtilityNotFoundException;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/service-requests")
public class ServiceRequestController {

  private final ServiceTargetRegistry targetRegistry;
  private final ServiceRequestRunner requestRunner;
  private final TestingUtilityService testingUtilityService;

  public ServiceRequestController(
      ServiceTargetRegistry targetRegistry,
      ServiceRequestRunner requestRunner,
      TestingUtilityService testingUtilityService) {
    this.targetRegistry = targetRegistry;
    this.requestRunner = requestRunner;
    this.testingUtilityService = testingUtilityService;
  }

  @GetMapping("/targets")
  public ResponseEntity<Map<String, Object>> listTargets() {
    return ResponseEntity.ok(Map.of("targets", targetRegistry.listTargets()));
  }

  @PostMapping
  public ResponseEntity<ServiceRequestResult> runRequest(@RequestBody ServiceRequest request) {
    ServiceRequestResult result = requestRunner.run(request);
    HttpStatus status = switch (result.status()) {
      case blocked -> HttpStatus.BAD_REQUEST;
      case timed_out -> HttpStatus.GATEWAY_TIMEOUT;
      case failed -> "target_unavailable".equals(result.errorCategory())
          ? HttpStatus.NOT_FOUND
          : HttpStatus.OK;
      case pending, succeeded -> HttpStatus.OK;
    };
    return ResponseEntity.status(status).body(result);
  }

  @PostMapping("/utilities/{utilityId}/runs")
  public ResponseEntity<?> runUtility(
      @PathVariable String utilityId, @RequestBody TestingUtilityRun.Request request) {
    try {
      return ResponseEntity.ok(testingUtilityService.run(utilityId, request));
    } catch (UtilityNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
          "status", "failed",
          "errorCategory", "utility_not_found",
          "errorMessage", e.getMessage()));
    } catch (ConfirmationRequiredException e) {
      return ResponseEntity.badRequest().body(Map.of(
          "status", "failed",
          "errorCategory", "confirmation_required",
          "errorMessage", e.getMessage()));
    }
  }
}
