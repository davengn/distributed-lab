# Lab 04: Workflow & Communication Patterns

## Overview

This lab explores distributed workflow orchestration, idempotency guarantees,
and communication protocol trade-offs in a microservices environment.

## Prerequisites

- DistributedLab platform running via `docker compose up`
- Kafka broker accessible at `kafka:9092`
- OpenTelemetry collector OTLP HTTP endpoint running at `otel-collector:4318`

## Scenarios

### Scenario 1: Saga Pattern — Distributed Transaction Orchestration

**Objective:** Understand how a saga orchestrator coordinates multi-service
transactions without distributed locks or two-phase commit.

**Steps:**

1. Open the Control Panel and navigate to **Labs > Workflows**.
2. Click **Start Saga** in the Saga Visualizer.
3. Observe the animated message flow between services.
4. Watch each step transition: `pending` -> `running` -> `completed`.
5. Inspect the structured logs in each service for correlation IDs.

**What to observe:**

- The orchestrator calls each service in sequence (create-order, process-payment, confirm-order).
- Each step has its own timeout and error handling.
- If any step fails, compensation logic runs for all previously completed steps.

**Failure injection:**

1. Go to the Chaos Console and inject a `latency` fault on `payment-service` (e.g., 2000ms).
2. Return to Workflows Lab and start a new saga.
3. Observe how the saga handles the timeout and triggers compensation.

### Scenario 2: Idempotency — Exactly-Once Processing

**Objective:** Demonstrate how idempotency keys prevent duplicate processing
when requests are retried.

**Steps:**

1. In the Idempotency Tester, click **Replay (5x)**.
2. Watch 5 identical payment requests get sent with the same idempotency key.
3. Observe that only 1 payment is actually processed.
4. The remaining 4 are detected as duplicates and blocked.
5. When counts match (1 processed out of 5), the green confirmation appears.

**What to observe:**

- The `idempotencyKey` is stored in a ConcurrentHashMap on first request.
- Subsequent requests with the same key return the cached result without re-processing.
- The request count (5) vs processing count (1) proves exactly-once semantics.

### Scenario 3: Communication Protocol Comparison

**Objective:** Compare latency and throughput characteristics of REST, gRPC,
and Kafka for inter-service communication.

**Steps:**

1. In the Communication Comparison panel, click **Run Comparison**.
2. Observe the three-column metrics showing latency and throughput for each protocol.
3. Review the visual latency bar chart.
4. Note the fastest protocol and the relative differences.

**What to observe:**

| Protocol  | Characteristics                                    |
|-----------|----------------------------------------------------|
| REST      | HTTP/1.1 JSON, human-readable, moderate latency    |
| gRPC      | HTTP/2 protobuf, binary, lowest latency            |
| Kafka     | Async event streaming, decoupled, fire-and-forget  |

**Discussion points:**

- When would you choose REST over gRPC? (external APIs, simplicity)
- When is Kafka the right choice? (event-driven, decoupling, replay)
- How does the choice affect observability and debugging?

## Architecture

```
Control Panel (Next.js)
        |
    Lab API (Spring Boot)
    /       |       \
REST     Kafka     gRPC
  |        |         |
Order Service  Payment Service
  (8082)        (8083)
```

## Services

| Service           | Port | Role                                      |
|-------------------|------|-------------------------------------------|
| `order-service`   | 8082 | Creates and manages orders via Kafka      |
| `payment-service` | 8083 | Processes payments with idempotency       |
| `lab-api`         | 3001 | Saga orchestrator and lab endpoints       |
| `control-panel`   | 3000 | Frontend UI for lab exercises             |

## Key Concepts

- **Saga Pattern**: A sequence of local transactions where each step publishes
  an event or triggers the next step, with compensating transactions on failure.
- **Idempotency**: Ensures that processing the same request multiple times
  produces the same result as processing it once.
- **Communication Trade-offs**: REST (synchronous, human-readable), gRPC
  (synchronous, high-performance), Kafka (asynchronous, decoupled).
