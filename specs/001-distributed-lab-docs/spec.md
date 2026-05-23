# Feature Specification: DistributedLab Platform

**Feature Branch**: `001-distributed-lab-docs`

**Created**: 2026-05-23

**Status**: Draft

**Input**: User description: "Create development documentation for DistributedLab — a self-hosted, open-source learning sandbox for distributed systems and microservices concepts, based on the product specification and UI prototype."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Launch Full Sandbox Environment (Priority: P1)

A learner runs `docker compose up` and within 120 seconds has a fully operational multi-service environment with a web control panel, observability stack, and sandbox services — all running locally with no cloud account or manual configuration required.

**Why this priority**: The core promise of DistributedLab is one-command startup. Without this, no other feature is accessible. This is the MVP that must work first.

**Independent Test**: Run `docker compose up` on a clean machine with Docker installed. Verify all containers start, the control panel is accessible at `http://localhost:3000`, and the observability dashboards are reachable.

**Acceptance Scenarios**:

1. **Given** a machine with Docker and Docker Compose installed, **When** the user runs `docker compose up`, **Then** all containers (control panel, Lab API, monolith, observability stack) start within 120 seconds on a machine with 8 GB RAM and 4 CPU cores.
2. **Given** all containers are running, **When** the user navigates to `http://localhost:3000`, **Then** the DistributedLab control panel loads with sidebar navigation (Dashboard, Labs, Chaos, Registry) and displays service health status.
3. **Given** the environment is running, **When** the user toggles dark/light mode, **Then** all UI screens update consistently without visual artifacts.

---

### User Story 2 - Observe Running Services (Priority: P1)

A learner opens the Dashboard and sees real-time metrics for all running services: CPU/memory usage, health status, active experiments, and a live event feed. They can navigate to Grafana, Jaeger, and the service registry without leaving the platform.

**Why this priority**: Observability is the "paved road" for all labs. Learners must see signal before they can interpret experiments. This ships as Module 05 and is built first.

**Independent Test**: Start the environment, open the Dashboard, verify all 6 services show health status, metrics sparklines render, and the event feed updates in real time.

**Acceptance Scenarios**:

1. **Given** the environment is running, **When** the user opens the Dashboard, **Then** metric cards display service count, active experiments, system health percentage, and uptime.
2. **Given** services are running, **When** the user views Service Health, **Then** each service card shows name, version, port, CPU percentage bar, and memory percentage bar with correct color coding (green/amber/red).
3. **Given** events are occurring, **When** the user views Recent Events, **Then** a chronological feed displays with timestamps, event icons (colored by severity), and descriptive text.

---

### User Story 3 - Run Migration & Decomposition Lab (Priority: P2)

A learner opens the Migration Lab module, selects the Strangler Fig experiment, configures route redirects from the monolith to a new catalog-service via the control panel, and observes traffic shifting in real time — including a parallel-run diff comparison.

**Why this priority**: Module 01 (Migration & Decomposition) is the first hands-on lab. It demonstrates the most common microservices pattern (monolith decomposition) and validates the proxy + control panel architecture.

**Independent Test**: Start the environment, navigate to Labs → Module 01, start a Strangler Fig experiment redirecting `/api/catalog` to `catalog-service`, verify traffic flows to the new service and the diff viewer shows response comparison.

**Acceptance Scenarios**:

1. **Given** the Migration Lab is open, **When** the user selects "Strangler Fig proxy", **Then** a configuration form allows selecting a source route, target service, and traffic percentage.
2. **Given** a Strangler Fig redirect is active, **When** requests hit the redirected route, **Then** the monolith proxy forwards traffic to the catalog-service and metrics show the split.
3. **Given** a Parallel Run is active, **When** the user fires a test request, **Then** a side-by-side diff viewer shows the monolith response vs. the microservice response with highlighted differences.

---

### User Story 4 - Explore Data Consistency (Priority: P2)

A learner opens the Distributed Data & Consistency Sandbox, cuts the network link between two nodes in the CAP theorem visualizer, and observes the system choosing between consistency and availability in real time.

**Why this priority**: Module 02 demonstrates core distributed systems concepts. The CAP visualizer is the most visually compelling and educationally impactful experiment.

**Independent Test**: Start the environment, navigate to Labs → Module 02, start a CAP partition experiment, cut the network link, verify the dashboard shows C vs. A behavior.

**Acceptance Scenarios**:

1. **Given** the CAP visualizer is running, **When** the learner clicks "Cut Network", **Then** a visual indicator shows the partition and the dashboard updates to show whether the system chose Consistency (reject writes) or Availability (allow divergent writes).
2. **Given** the replication lag simulator is running, **When** the learner adjusts the lag slider to 250ms, **Then** read-your-writes violations are highlighted visually within 2 seconds.

---

### User Story 5 - Inject Chaos & Observe Resilience (Priority: P3)

A learner opens the Chaos Console, injects latency into the payment-service, and observes the circuit breaker opening in real time as the failure threshold is crossed — with the cascading failure map showing the blast radius containment.

**Why this priority**: Module 03 (Resiliency & Chaos) validates the fault injection infrastructure and demonstrates stability patterns. It requires Module 05 (observability) to be fully operational.

**Independent Test**: Start the environment, navigate to Chaos, inject +200ms latency into payment-service, verify the circuit breaker opens after 3 failures and the cascading failure map highlights the degraded service.

**Acceptance Scenarios**:

1. **Given** the Chaos Console is open, **When** the user selects a fault type, target service, duration, and magnitude and clicks "Inject Fault", **Then** the fault appears in the Active Faults table with a "Stop" button.
2. **Given** latency is injected into payment-service, **When** 3 consecutive failures occur within 60 seconds, **Then** the circuit breaker for payment-service transitions to "Open" state with visible status change.
3. **Given** a fault is active, **When** the user views the Cascading Failure Map, **Then** the degraded service and its connections are highlighted with dashed amber/red lines.

---

### User Story 6 - Visualize Sagas & Test Idempotency (Priority: P3)

A learner opens the Workflow Explorer, runs the same order-fulfillment saga in both orchestrated and choreographed modes side-by-side, and observes message flow differences. They also test idempotency by replaying a POST request and verifying exactly-once processing.

**Why this priority**: Module 04 demonstrates advanced patterns. It requires Kafka, multiple services, and the saga infrastructure to be in place.

**Independent Test**: Start the environment, navigate to Labs → Module 04, run a choreographed saga, verify the real-time map shows messages flowing between services.

**Acceptance Scenarios**:

1. **Given** the Saga visualizer is open, **When** the user runs a choreographed saga, **Then** a real-time map shows messages flowing between services with timestamps and coupling indicators.
2. **Given** the Idempotency tester is open, **When** the user replays the same POST request 5 times, **Then** the UI confirms side effects occurred exactly once with the Idempotency-Key mechanism active.

---

### Edge Cases

- What happens when Docker is not installed or not running? The system MUST display a clear error message with installation instructions.
- What happens when the machine has less than 8 GB RAM? The system SHOULD start but MAY be slow; containers with memory limits set will be OOM-killed gracefully.
- What happens when a learner kills a critical service (e.g., Kafka) mid-experiment? The cascading failure map MUST reflect the failure and the control panel MUST remain operational.
- What happens when the learner closes the browser mid-experiment? Experiments continue server-side and state is recoverable on reconnect.
- What happens when two experiments target the same service simultaneously? The system MUST prevent conflicting fault injections and surface a warning.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Docker Compose configuration that starts the entire platform with a single command
- **FR-002**: System MUST provide a Next.js control panel with Dashboard, Labs, Chaos, and Registry views
- **FR-003**: System MUST provide a Spring Boot Lab API that manipulates containers and injects faults via Docker socket and Toxiproxy
- **FR-004**: System MUST include a MusicCorp-style monolith application with catalog, order, and payment domains in a single PostgreSQL schema
- **FR-005**: System MUST provide an Envoy-based Strangler Fig proxy with UI-controlled route redirects
- **FR-006**: System MUST provide a Parallel Run comparator that diffs JSON responses from monolith and extracted services
- **FR-007**: System MUST provide a Redis-backed feature toggle dashboard for runtime flag control
- **FR-008**: System MUST provide a CAP theorem visualizer with a two-node key-value store and manual network partition
- **FR-009**: System MUST provide a replication lag simulator with configurable async PostgreSQL replication and visual lag display
- **FR-010**: System MUST provide a multi-model data explorer comparing PostgreSQL, MongoDB, and Neo4j for the same domain
- **FR-011**: System MUST provide a CDC pipeline (Debezium → Kafka → Elasticsearch) with pause/replay/corrupt capabilities
- **FR-012**: System MUST provide a chaos engineering panel for fault injection (latency, packet loss, kill, memory, partition) via Toxiproxy
- **FR-013**: System MUST provide pre-wired Resilience4j circuit breaker and bulkhead templates with real-time visualization
- **FR-014**: System MUST provide a cascading failure visualizer showing service dependency health
- **FR-015**: System MUST provide saga visualization for both orchestrated and choreographed patterns
- **FR-016**: System MUST provide an idempotency tester with replay and verification capabilities
- **FR-017**: System MUST provide a communication style lab comparing REST, gRPC, and Kafka for the same interaction
- **FR-018**: System MUST provide a Pact Broker for consumer-driven contract testing
- **FR-019**: System MUST provide pre-configured Prometheus + Grafana for metrics aggregation
- **FR-020**: System MUST provide Jaeger with OpenTelemetry for distributed tracing
- **FR-021**: System MUST provide Loki + Promtail for structured log collection
- **FR-022**: System MUST provide a Backstage-inspired service registry listing each service with owner, health, API docs, version, and dependencies
- **FR-023**: System MUST support dark/light mode across all UI views
- **FR-024**: System MUST use WebSocket for real-time experiment data updates
- **FR-025**: System MUST provide a `_template` skeleton service with logging, health checks, and OpenTelemetry pre-wired

### Key Entities

- **Service**: A Docker container running a Spring Boot microservice or infrastructure component; has name, version, port, status (running/degraded/stopped), CPU/memory metrics, upstream/downstream dependencies
- **Experiment**: An active lab scenario with a unique ID, type (Strangler Fig, CAP partition, chaos injection, etc.), target service, status (running/completed/failed), and configuration parameters
- **Fault**: An active fault injection with ID, type (latency/packet_loss/kill/memory/partition), target service, magnitude, and duration
- **Lab Module**: One of five educational modules (Migration, Consistency, Chaos, Workflow, Observability) containing multiple features/experiments
- **Feature Toggle**: A runtime flag with key, current value (enabled/disabled), backing store (Redis), and associated service
- **Saga Instance**: A running saga (orchestrated or choreographed) with step states, message flow log, and completion status
- **Circuit Breaker**: A Resilience4j circuit breaker instance with state (closed/open/half_open), failure count, success rate, and configured threshold

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The platform starts fully operational within 120 seconds via `docker compose up` on a machine with 8 GB RAM and 4 CPU cores
- **SC-002**: All 6+ services show health status on the Dashboard within 10 seconds of page load
- **SC-003**: Real-time experiment data updates in the UI within 2 seconds of occurrence
- **SC-004**: Control panel API response times remain under 500 ms (p95)
- **SC-005**: A new contributor can add a lab scenario by following the plugin contract without modifying core platform code
- **SC-006**: The entire platform runs on a local machine with no cloud account or external services required

## Assumptions

- Users have Docker and Docker Compose installed on their development machine
- The target machine has at least 8 GB RAM and 4 CPU cores for reasonable performance
- Users have a modern web browser (Chrome, Firefox, Safari, Edge — latest 2 versions)
- The platform runs locally only; cloud deployment and multi-user authentication are out of scope for v1
- All code is original implementation of described patterns; no book content is reproduced verbatim
- The project is MIT licensed and intended for open-source community contribution
- The monorepo uses pnpm for frontend and Maven for backend dependency management
