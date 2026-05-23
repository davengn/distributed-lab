# Data Model: DistributedLab Platform

**Date**: 2026-05-23 | **Feature**: DistributedLab Platform

## Entities

### Service

Represents a Docker container running a sandbox service or infrastructure component.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Container ID from Docker (unique) |
| name | string | Service name (e.g., "monolith", "catalog-service") |
| type | enum | `application`, `infrastructure`, `observability` |
| status | enum | `running`, `degraded`, `stopped`, `unknown` |
| version | string | Application version tag (e.g., "v1.2.0") |
| port | integer | Exposed port number |
| image | string | Docker image name |
| cpuPercent | float | Current CPU usage percentage |
| memoryPercent | float | Current memory usage percentage |
| memoryLimitMB | integer | Memory limit in MB from docker-compose.yml |
| dependencies | string[] | List of upstream/downstream service names |
| healthEndpoint | string | URL path for health check (e.g., "/actuator/health") |
| lastHealthCheck | timestamp | Last successful health check time |

**Relationships**:
- A Service has zero or more Experiments targeting it
- A Service has zero or more Faults injected into it
- A Service has zero or more CircuitBreakers protecting it

### Experiment

Represents an active or completed lab scenario.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique experiment ID (e.g., "EXP-001") |
| type | enum | `strangler_fig`, `parallel_run`, `cap_partition`, `replication_lag`, `chaos_injection`, `circuit_breaker`, `saga_orchestrated`, `saga_choreographed`, `idempotency_test`, `communication_comparison`, `cdc_pipeline` |
| module | integer | Module number (1-5) |
| status | enum | `pending`, `running`, `completed`, `failed` |
| targetService | string | Name of the target service |
| configuration | JSON | Experiment-specific config (route, percentage, magnitude, etc.) |
| startedAt | timestamp | Experiment start time |
| completedAt | timestamp | Experiment completion time (nullable) |
| result | JSON | Experiment results (metrics, observations, etc.) |

**Relationships**:
- An Experiment targets one or more Services
- An Experiment may produce zero or more Faults

### Fault

Represents an active fault injection via Toxiproxy.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique fault ID (e.g., "FLT-001") |
| type | enum | `latency`, `packet_loss`, `kill`, `memory`, `partition` |
| targetService | string | Name of the target service |
| magnitude | string | Fault magnitude (e.g., "200ms", "5%", "512MB") |
| durationSeconds | integer | Duration in seconds |
| status | enum | `active`, `stopped`, `expired` |
| toxyproxyId | string | Corresponding Toxiproxy toxic ID |
| injectedAt | timestamp | Fault injection time |

**Relationships**:
- A Fault targets exactly one Service
- A Fault belongs to zero or one Experiment

### CircuitBreaker

Represents a Resilience4j circuit breaker instance.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| serviceName | string | Protected service name |
| state | enum | `closed`, `open`, `half_open` |
| failureRateThreshold | float | Configured failure rate percentage |
| failureCount | integer | Current consecutive failure count |
| successRate | float | Current success rate percentage |
| slowCallRate | float | Percentage of calls exceeding slow call threshold |
| stateChangedAt | timestamp | Last state transition time |

**Relationships**:
- A CircuitBreaker protects exactly one Service

### LabModule

Represents one of the five educational lab modules.

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Module number (1-5) |
| name | string | Display name |
| description | string | Short description |
| concepts | string[] | Distributed systems concepts covered |
| features | Feature[] | List of features/experiments within the module |
| status | enum | `locked`, `available`, `in_progress`, `completed` |

### Feature (nested in LabModule)

Represents a specific feature within a lab module.

| Field | Type | Description |
|-------|------|-------------|
| name | string | Feature display name (concept-first, e.g., "Strangler Fig proxy") |
| description | string | What this feature demonstrates |
| serviceTarget | string | Which service(s) are involved |

### FeatureToggle

Represents a runtime feature flag (Migration Lab).

| Field | Type | Description |
|-------|------|-------------|
| key | string | Toggle key (e.g., "use-catalog-service") |
| enabled | boolean | Current state |
| serviceName | string | Owning service |
| description | string | What this toggle controls |

### SagaInstance

Represents a running saga (Workflow Lab).

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique saga instance ID |
| type | enum | `orchestrated`, `choreographed` |
| steps | SagaStep[] | Ordered list of saga steps |
| status | enum | `pending`, `running`, `completed`, `compensating`, `failed` |
| startedAt | timestamp | Saga start time |

### SagaStep (nested in SagaInstance)

| Field | Type | Description |
|-------|------|-------------|
| name | string | Step name (e.g., "create_order", "process_payment") |
| service | string | Executing service name |
| status | enum | `pending`, `running`, `completed`, `failed`, `compensated` |
| message | JSON | Message payload sent/received |
| timestamp | timestamp | Step execution time |

## State Transitions

### Service Status
```
stopped → running (container starts)
running → degraded (health check fails, circuit breaker opens)
degraded → running (health recovers)
running → stopped (container stops)
degraded → stopped (container stops)
```

### Experiment Status
```
pending → running (experiment started)
running → completed (experiment finishes successfully)
running → failed (experiment encounters error)
```

### Circuit Breaker State
```
closed → open (failure rate exceeds threshold)
open → half_open (wait duration expires)
half_open → closed (success rate recovers)
half_open → open (failure rate still exceeds threshold)
```

### Saga Status
```
pending → running (saga initiated)
running → completed (all steps succeed)
running → compensating (step fails, triggering compensation)
compensating → failed (compensation completed)
running → failed (unrecoverable error)
```
