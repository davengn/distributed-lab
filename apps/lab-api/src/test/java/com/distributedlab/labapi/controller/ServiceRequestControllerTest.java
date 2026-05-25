package com.distributedlab.labapi.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.distributedlab.labapi.model.ServiceRequestTarget;
import com.distributedlab.labapi.model.ServiceRequestTarget.TargetStatus;
import com.distributedlab.labapi.service.ServiceRequestRunner;
import com.distributedlab.labapi.service.ServiceTargetRegistry;
import com.distributedlab.labapi.service.ServiceTargetRegistry.ResolvedServiceTarget;
import com.distributedlab.labapi.service.TestingUtilityService;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.client.RestTemplate;

class ServiceRequestControllerTest {

  private MockMvc mockMvc;
  private FakeServiceTargetRegistry targetRegistry;

  @BeforeEach
  void setUp() {
    targetRegistry = new FakeServiceTargetRegistry();
    ServiceRequestRunner requestRunner =
        new ServiceRequestRunner(new RestTemplate(), targetRegistry);
    TestingUtilityService testingUtilityService = new TestingUtilityService(targetRegistry);
    mockMvc = MockMvcBuilders
        .standaloneSetup(new ServiceRequestController(
            targetRegistry,
            requestRunner,
            testingUtilityService))
        .build();
  }

  @Test
  void listsAllowedServiceRequestTargets() throws Exception {
    mockMvc.perform(get("/api/v1/service-requests/targets"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.targets", hasSize(1)))
        .andExpect(jsonPath("$.targets[0].id").value("catalog-service"))
        .andExpect(jsonPath("$.targets[0].status").value("ready"));
  }

  @Test
  void returnsBadRequestForBlockedRequestResults() throws Exception {
    mockMvc.perform(post("/api/v1/service-requests")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"targetId":"catalog-service","method":"GET","path":"http://example.test"}
                """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.status").value("blocked"))
        .andExpect(jsonPath("$.fieldErrors.path").exists());
  }

  @Test
  void runsTestingUtilities() throws Exception {
    mockMvc.perform(post("/api/v1/service-requests/utilities/service-health-check/runs")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"targetId\":\"catalog-service\",\"moduleId\":\"migration\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.utilityId").value("service-health-check"))
        .andExpect(jsonPath("$.status").value("succeeded"));
  }

  @Test
  void returnsNotFoundForUnknownUtilities() throws Exception {
    mockMvc.perform(post("/api/v1/service-requests/utilities/missing/runs")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{}"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.errorCategory").value("utility_not_found"));
  }

  @Test
  void requiresConfirmationForStateChangingUtilities() throws Exception {
    mockMvc.perform(post("/api/v1/service-requests/utilities/safe-reset/runs")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"confirmed\":false}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.errorCategory").value("confirmation_required"));
  }

  private ServiceRequestTarget target() {
    return new ServiceRequestTarget(
        "catalog-service",
        "Catalog Service",
        TargetStatus.ready,
        List.of("migration"),
        List.of("GET"),
        "/actuator/health",
        Instant.parse("2026-05-24T00:00:00Z"));
  }

  private class FakeServiceTargetRegistry extends ServiceTargetRegistry {

    FakeServiceTargetRegistry() {
      super(null);
    }

    @Override
    public List<ServiceRequestTarget> listTargets() {
      return List.of(target());
    }

    @Override
    public Optional<ResolvedServiceTarget> resolve(String targetId) {
      return Optional.empty();
    }
  }
}
