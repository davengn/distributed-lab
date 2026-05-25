package com.distributedlab.labapi.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ServiceRequest(
    String targetId,
    String method,
    String path,
    Map<String, String> query,
    Map<String, String> headers,
    String body,
    Integer timeoutMs,
    String clientRequestId) {}
