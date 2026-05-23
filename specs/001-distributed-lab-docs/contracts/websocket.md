# WebSocket Event Protocol

**Endpoint**: `ws://localhost:3001/ws`

**Protocol**: STOMP over WebSocket

## Subscription Destinations

### /topic/services

Real-time service health and metric updates.

**Message**:
```json
{
  "type": "SERVICE_UPDATE",
  "payload": {
    "name": "payment-service",
    "status": "degraded",
    "cpuPercent": 45.0,
    "memoryPercent": 71.0,
    "timestamp": "2026-05-23T14:18:00Z"
  }
}
```

### /topic/experiments

Experiment state changes.

**Message**:
```json
{
  "type": "EXPERIMENT_STARTED",
  "payload": {
    "id": "EXP-001",
    "type": "strangler_fig",
    "status": "running",
    "timestamp": "2026-05-23T14:23:00Z"
  }
}
```

```json
{
  "type": "EXPERIMENT_COMPLETED",
  "payload": {
    "id": "EXP-004",
    "type": "cap_partition",
    "status": "completed",
    "result": { "consistencyChosen": false, "divergentWrites": 3 },
    "timestamp": "2026-05-23T14:30:00Z"
  }
}
```

### /topic/faults

Fault injection and removal events.

**Message**:
```json
{
  "type": "FAULT_INJECTED",
  "payload": {
    "id": "FLT-001",
    "type": "latency",
    "targetService": "payment-service",
    "magnitude": "+200ms",
    "timestamp": "2026-05-23T14:18:00Z"
  }
}
```

```json
{
  "type": "FAULT_REMOVED",
  "payload": {
    "id": "FLT-001",
    "timestamp": "2026-05-23T14:19:00Z"
  }
}
```

### /topic/circuit-breakers

Circuit breaker state transitions.

**Message**:
```json
{
  "type": "CIRCUIT_BREAKER_STATE_CHANGE",
  "payload": {
    "serviceName": "payment-service",
    "previousState": "closed",
    "newState": "open",
    "failureCount": 3,
    "timestamp": "2026-05-23T14:18:30Z"
  }
}
```

### /topic/events

General event feed (aggregated from all topics).

**Message**:
```json
{
  "type": "EVENT",
  "payload": {
    "severity": "warning",
    "message": "Circuit breaker OPEN: payment-service (3 consecutive failures in 60s)",
    "timestamp": "2026-05-23T14:18:30Z"
  }
}
```

**Severity levels**: `info`, `success`, `warning`, `error`

## Client Actions

Clients can send commands to the Lab API via STOMP:

### /app/experiments/start

Start an experiment (same payload as REST POST /experiments).

### /app/faults/inject

Inject a fault (same payload as REST POST /faults).

### /app/faults/{id}/stop

Stop a fault by ID.
