# Lab API REST Contract

**Base URL**: `http://localhost:3001/api/v1`

## Service Management

### GET /services

List all running services with health and metrics.

**Response 200**:
```json
[
  {
    "id": "abc123def456",
    "name": "monolith",
    "type": "application",
    "status": "running",
    "version": "v1.2.0",
    "port": 8080,
    "image": "distributed-lab/monolith:latest",
    "cpuPercent": 34.0,
    "memoryPercent": 62.0,
    "memoryLimitMB": 1024,
    "dependencies": ["catalog-service", "order-service", "payment-service"],
    "healthEndpoint": "/actuator/health",
    "lastHealthCheck": "2026-05-23T14:32:00Z"
  }
]
```

### GET /services/{name}

Get details for a specific service.

**Response 200**: Single service object (same shape as array item).

**Response 404**: `{ "error": "Service not found", "name": "{name}" }`

## Experiment Management

### GET /experiments

List all experiments.

**Response 200**:
```json
[
  {
    "id": "EXP-001",
    "type": "strangler_fig",
    "module": 1,
    "status": "running",
    "targetService": "monolith",
    "configuration": {
      "route": "/api/catalog",
      "targetService": "catalog-service",
      "trafficPercent": 100
    },
    "startedAt": "2026-05-23T14:23:00Z",
    "completedAt": null,
    "result": null
  }
]
```

### POST /experiments

Start a new experiment.

**Request**:
```json
{
  "type": "strangler_fig",
  "targetService": "monolith",
  "configuration": {
    "route": "/api/catalog",
    "targetService": "catalog-service",
    "trafficPercent": 100
  }
}
```

**Response 201**: Created experiment object.

**Response 400**: `{ "error": "Invalid configuration", "details": "..." }`

**Response 409**: `{ "error": "Conflicting experiment active", "conflictId": "EXP-001" }`

### GET /experiments/{id}

Get experiment details.

**Response 200**: Experiment object with `result` populated if completed.

### DELETE /experiments/{id}

Stop and clean up an experiment.

**Response 204**: No content.

## Fault Injection

### GET /faults

List active faults.

**Response 200**:
```json
[
  {
    "id": "FLT-001",
    "type": "latency",
    "targetService": "payment-service",
    "magnitude": "200ms",
    "durationSeconds": 60,
    "status": "active",
    "toxiproxyId": "tpx-downstream",
    "injectedAt": "2026-05-23T14:18:00Z"
  }
]
```

### POST /faults

Inject a new fault.

**Request**:
```json
{
  "type": "latency",
  "targetService": "payment-service",
  "magnitude": "200ms",
  "durationSeconds": 60
}
```

**Response 201**: Created fault object.

**Response 400**: `{ "error": "Invalid fault parameters", "details": "..." }`

### DELETE /faults/{id}

Remove an active fault.

**Response 204**: No content.

## Circuit Breakers

### GET /circuit-breakers

List all circuit breaker states.

**Response 200**:
```json
[
  {
    "id": "cb-payment-service",
    "serviceName": "payment-service",
    "state": "open",
    "failureRateThreshold": 50.0,
    "failureCount": 3,
    "successRate": 12.0,
    "slowCallRate": 0.0,
    "stateChangedAt": "2026-05-23T14:18:30Z"
  }
]
```

## Lab Modules

### GET /modules

List all lab modules with features.

**Response 200**:
```json
[
  {
    "id": 1,
    "name": "Migration & Decomposition Lab",
    "description": "Strangler Fig proxy, Parallel Run comparator, and feature toggle dashboard.",
    "concepts": ["Strangler Fig", "Parallel Run", "Feature Toggles"],
    "features": [
      {
        "name": "Strangler Fig proxy",
        "description": "Configurable HTTP proxy where learners redirect routes.",
        "serviceTarget": "monolith, catalog-service"
      }
    ],
    "status": "available"
  }
]
```

## Feature Toggles (Migration Lab)

### GET /toggles

List all feature toggles.

### PUT /toggles/{key}

Update a feature toggle state.

**Request**: `{ "enabled": true }`

## Saga (Workflow Lab)

### POST /sagas/start

Start a saga instance.

**Request**:
```json
{
  "type": "choreographed",
  "orderId": "ORD-001",
  "steps": ["create_order", "reserve_inventory", "process_payment", "confirm_shipment"]
}
```

### GET /sagas/{id}

Get saga instance with step states.

## Health

### GET /actuator/health

Lab API health check endpoint.

**Response 200**: `{ "status": "UP", "dockerSocket": true, "toxiproxy": true }`
