# Contract: Service Request API

This contract defines the Lab API surface used by the control panel testing workspace. The API is constrained to local lab services and must not act as a general internet request proxy.

## GET /api/v1/service-requests/targets

Returns service targets eligible for learner requests.

### Response 200

```json
{
  "targets": [
    {
      "id": "catalog-service",
      "name": "catalog-service",
      "status": "ready",
      "moduleIds": ["migration", "workflows"],
      "allowedMethods": ["GET", "POST"],
      "healthPath": "/actuator/health",
      "lastObservedAt": "2026-05-24T00:00:00Z"
    }
  ]
}
```

### Rules

- Only local lab services may be returned.
- Unavailable services may be returned with `status: "unavailable"` so the UI can explain the state.
- Internal base URLs and Docker implementation details must not be exposed.

## POST /api/v1/service-requests

Executes a learner request against an allowed local lab service.

### Request

```json
{
  "targetId": "catalog-service",
  "method": "GET",
  "path": "/api/catalog/items",
  "query": {
    "limit": "5"
  },
  "headers": {
    "X-Lab-Scenario": "baseline"
  },
  "body": null,
  "timeoutMs": 5000,
  "clientRequestId": "req_123"
}
```

### Response 200

```json
{
  "id": "req_123",
  "targetId": "catalog-service",
  "method": "GET",
  "path": "/api/catalog/items",
  "status": "succeeded",
  "httpStatus": 200,
  "durationMs": 42,
  "responseHeaders": {
    "content-type": "application/json"
  },
  "bodyPreview": "[{\"id\":\"album-1\",\"title\":\"Kind of Blue\"}]",
  "bodyTruncated": false,
  "startedAt": "2026-05-24T00:00:00Z",
  "completedAt": "2026-05-24T00:00:00Z"
}
```

### Response 400

```json
{
  "status": "blocked",
  "errorCategory": "validation",
  "errorMessage": "Path must be relative and start with /.",
  "fieldErrors": {
    "path": "Path must be relative and start with /."
  }
}
```

### Response 404

```json
{
  "status": "failed",
  "errorCategory": "target_unavailable",
  "errorMessage": "Target service is not available in the local lab environment."
}
```

### Response 504

```json
{
  "status": "timed_out",
  "errorCategory": "timeout",
  "errorMessage": "The request exceeded the configured timeout.",
  "durationMs": 5000
}
```

### Rules

- `targetId`, `method`, and `path` are required.
- `path` must be relative, start with `/`, and must not contain a scheme, host, or parent-directory traversal.
- `method` must be allowed for the selected target.
- `timeoutMs` must be bounded by the server configuration.
- The API must log target, method, path, result status, duration, and error category without logging sensitive request bodies by default.
- Response body previews must be capped before returning to the browser.

## POST /api/v1/service-requests/utilities/{utilityId}/runs

Runs a supported lab testing utility.

### Request

```json
{
  "targetId": "catalog-service",
  "moduleId": "migration",
  "confirmed": true
}
```

### Response 200

```json
{
  "utilityId": "service-health-check",
  "status": "succeeded",
  "message": "Service health check completed.",
  "details": {
    "catalog-service": "ready"
  },
  "durationMs": 28,
  "completedAt": "2026-05-24T00:00:00Z"
}
```

### Rules

- Unknown utilities must return 404.
- State-changing utilities must require `confirmed: true`.
- Utility execution must remain scoped to local lab services and safe lab reset behaviors.
