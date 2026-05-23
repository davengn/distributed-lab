# Tasks: DistributedLab Platform

**Input**: Design documents from `/specs/001-distributed-lab-docs/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Constitution Principle II mandates TDD. Test tasks are included for all user stories.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `apps/control-panel/src/`
- **Backend**: `apps/lab-api/src/main/java/com/distributedlab/labapi/`
- **Services**: `services/<service-name>/`
- **Infrastructure**: `infra/`
- **Labs**: `labs/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Monorepo initialization, tooling, and project scaffolding

- [ ] T001 Create monorepo directory structure per plan.md (apps/, services/, infra/, labs/, docs/)
- [ ] T002 Initialize pnpm workspace and Next.js 16 control panel project in apps/control-panel/package.json
- [ ] T003 Create Maven parent POM with Java 21, Spring Boot 3, Checkstyle, Surefire, Jacoco plugins in pom.xml
- [ ] T004 [P] Configure ESLint + Prettier for control panel in apps/control-panel/.eslintrc.js and apps/control-panel/.prettierrc
- [ ] T005 [P] Configure Tailwind CSS with custom theme in apps/control-panel/tailwind.config.ts
- [ ] T006 Create .env file with default port assignments and resource limits in .env

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and skeletons that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

### Observability Stack

- [ ] T007 [P] Configure Prometheus with Docker service discovery in infra/observability/prometheus.yml
- [ ] T008 [P] Create Grafana provisioning with pre-built dashboards in infra/observability/grafana/
- [ ] T009 [P] Configure OTel Collector + Jaeger in infra/observability/jaeger/otel-collector-config.yml
- [ ] T010 [P] Configure Loki + Promtail for structured log collection in infra/observability/loki/promtail-config.yml

### Service Template (with OTel from creation per Constitution V)

- [ ] T011 Create \_template skeleton Spring Boot service with OTel agent, health check, structured logging in services/\_template/
- [ ] T012 Create \_template Dockerfile using Eclipse Temurin Java 21 JRE with OTel Java agent in services/\_template/Dockerfile
- [ ] T013 Create \_template README.md with service creation instructions in services/\_template/README.md

### Lab API Core

- [ ] T014 Create Lab API Spring Boot project with Web, Actuator, WebSocket, OTel starters in apps/lab-api/pom.xml
- [ ] T015 Create Lab API model classes (ServiceInfo, Experiment, Fault, CircuitBreaker, LabModule) in apps/lab-api/src/main/java/com/distributedlab/labapi/model/
- [ ] T016 Implement Docker Java SDK client for container listing, health, and metrics in apps/lab-api/src/main/java/com/distributedlab/labapi/client/DockerClient.java
- [ ] T017 Implement Toxiproxy client wrapper for fault injection in apps/lab-api/src/main/java/com/distributedlab/labapi/client/ToxiproxyClient.java
- [ ] T018 Configure STOMP WebSocket with message broker in apps/lab-api/src/main/java/com/distributedlab/labapi/config/WebSocketConfig.java
- [ ] T019 Configure CORS to allow requests from localhost:3000 in apps/lab-api/src/main/java/com/distributedlab/labapi/config/CorsConfig.java
- [ ] T020 Implement ServiceController (GET /api/v1/services) in apps/lab-api/src/main/java/com/distributedlab/labapi/controller/ServiceController.java
- [ ] T021 Implement FaultController (GET/POST/DELETE /api/v1/faults) in apps/lab-api/src/main/java/com/distributedlab/labapi/controller/FaultController.java
- [ ] T022 Implement ExperimentController (GET/POST/DELETE /api/v1/experiments) in apps/lab-api/src/main/java/com/distributedlab/labapi/controller/ExperimentController.java
- [ ] T023 Create Lab API Dockerfile with Docker socket mount in apps/lab-api/Dockerfile

### MusicCorp Monolith

- [ ] T024 Create monolith Spring Boot project with Web, Data JPA, Actuator starters in services/monolith/pom.xml
- [ ] T025 Implement monolith schema (catalog, order, payment tables) with Flyway migration in services/monolith/src/main/resources/db/migration/
- [ ] T026 Implement catalog domain (entity, repository, REST controller) in services/monolith/src/main/java/com/distributedlab/monolith/catalog/
- [ ] T027 [P] Implement order domain (entity, repository, REST controller) in services/monolith/src/main/java/com/distributedlab/monolith/order/
- [ ] T028 [P] Implement payment domain (entity, repository, REST controller) in services/monolith/src/main/java/com/distributedlab/monolith/payment/
- [ ] T029 Create monolith Dockerfile in services/monolith/Dockerfile
- [ ] T030 Add seed data for MusicCorp catalog, sample orders in services/monolith/src/main/resources/data.sql

### Control Panel Shell

- [ ] T031 Implement design system CSS custom properties (all 22 color tokens, typography, dark mode) in apps/control-panel/src/styles/globals.css
- [ ] T032 Implement layout components (Sidebar, Topbar, Content wrapper) per ui-design-system.md in apps/control-panel/src/components/Layout.tsx
- [ ] T033 Implement dark/light mode toggle hook and provider in apps/control-panel/src/hooks/useTheme.ts
- [ ] T034 Implement WebSocket client hook (STOMP) with reconnection in apps/control-panel/src/hooks/useWebSocket.ts
- [ ] T035 Implement REST API client module for Lab API in apps/control-panel/src/lib/api-client.ts
- [ ] T036 Create root layout with sidebar navigation and theme support in apps/control-panel/src/app/layout.tsx
- [ ] T037 Implement ErrorBoundary component with actionable error messages per Constitution III in apps/control-panel/src/components/ErrorBoundary.tsx

**Checkpoint**: Foundation ready — observability stack, Lab API, monolith, and control panel shell exist

---

## Phase 3: User Story 1 - Launch Full Sandbox Environment (Priority: P1) MVP

**Goal**: `docker compose up` starts the entire platform within 120 seconds

**Independent Test**: Run `docker compose up` on a clean machine; verify all containers healthy and control panel accessible at http://localhost:3000

### Tests for User Story 1

- [ ] T038 [P] [US1] Write integration test: docker compose health check passes for all containers in docker-compose.test.yml
- [ ] T039 [P] [US1] Write test: control panel page loads with sidebar nav items in apps/control-panel/tests/integration/dashboard.test.ts

### Implementation for User Story 1

- [ ] T040 [US1] Create docker-compose.yml with all services (control-panel, lab-api, monolith, postgres, redis, kafka, prometheus, grafana, jaeger, loki, toxiproxy) with health checks and memory limits in docker-compose.yml
- [ ] T041 [US1] Create docker-compose.dev.yml with hot reload overrides for Next.js and Spring Boot in docker-compose.dev.yml
- [ ] T042 [US1] Implement Dashboard placeholder page with metric card layout in apps/control-panel/src/app/page.tsx
- [ ] T043 [US1] Implement Labs placeholder page with module card grid in apps/control-panel/src/app/labs/page.tsx
- [ ] T044 [US1] Implement Chaos placeholder page with fault injection form skeleton in apps/control-panel/src/app/chaos/page.tsx
- [ ] T045 [US1] Implement Registry placeholder page with service catalog table in apps/control-panel/src/app/registry/page.tsx
- [ ] T046 [US1] Wire sidebar navigation with active state highlighting per ui-design-system.md in apps/control-panel/src/components/Sidebar.tsx
- [ ] T047 [US1] Validate full stack starts within 120s and all health checks pass in docker-compose.yml

**Checkpoint**: `docker compose up` launches the full platform; control panel shows all four nav items; dark/light mode works

---

## Phase 4: User Story 2 - Observe Running Services (Priority: P1)

**Goal**: Dashboard shows real-time service health, metrics, active experiments, and event feed

**Independent Test**: Open Dashboard; verify all services show status pills, CPU/MEM bars, sparklines render, and events update via WebSocket

### Tests for User Story 2

- [ ] T048 [P] [US2] Write test: GET /api/v1/services returns list of running services in apps/lab-api/src/test/java/com/distributedlab/labapi/controller/ServiceControllerTest.java
- [ ] T049 [P] [US2] Write test: WebSocket /topic/services pushes SERVICE_UPDATE events in apps/lab-api/src/test/java/com/distributedlab/labapi/controller/ServiceWebSocketTest.java

### Implementation for User Story 2

- [ ] T050 [P] [US2] Implement shared StatusPill component (running/degraded/stopped/open/closed/completed) in apps/control-panel/src/components/StatusPill.tsx
- [ ] T051 [P] [US2] Implement MetricCard component with sparkline SVG in apps/control-panel/src/components/MetricCard.tsx
- [ ] T052 [P] [US2] Implement ProgressBar component (green/amber/red fills) in apps/control-panel/src/components/ProgressBar.tsx
- [ ] T053 [P] [US2] Implement ServiceCard component with health metrics in apps/control-panel/src/components/ServiceCard.tsx
- [ ] T054 [US2] Implement Dashboard page with metrics row, service health grid, active experiments table, and event feed in apps/control-panel/src/app/page.tsx (replaces T042 placeholder)
- [ ] T055 [US2] Implement useServices hook to fetch and subscribe to /topic/services in apps/control-panel/src/hooks/useServices.ts
- [ ] T056 [US2] Implement useEvents hook to subscribe to /topic/events in apps/control-panel/src/hooks/useEvents.ts
- [ ] T057 [US2] Implement EventFeed component with severity icons and timestamps in apps/control-panel/src/components/EventFeed.tsx
- [ ] T058 [US2] Implement ExperimentsTable component in apps/control-panel/src/components/ExperimentsTable.tsx
- [ ] T059 [US2] Add Lab API scheduling to poll Docker for service metrics and push via WebSocket in apps/lab-api/src/main/java/com/distributedlab/labapi/service/ServiceMonitor.java
- [ ] T060 [US2] Implement service registry API endpoint (GET /api/v1/services/{name} with owner, health, API docs, version, dependencies) in apps/lab-api/src/main/java/com/distributedlab/labapi/controller/ServiceController.java

**Checkpoint**: Dashboard shows real-time service health with WebSocket updates; all 6+ services visible with status pills and metrics

---

## Phase 5: User Story 3 - Run Migration & Decomposition Lab (Priority: P2)

**Goal**: Learners can configure Strangler Fig redirects, run parallel comparisons, and flip feature toggles

**Independent Test**: Navigate Labs → Module 01, start Strangler Fig redirect, verify traffic shifts to catalog-service

### Tests for User Story 3

- [ ] T061 [P] [US3] Write test: POST /api/v1/experiments creates a strangler_fig experiment in apps/lab-api/src/test/java/com/distributedlab/labapi/controller/ExperimentControllerTest.java
- [ ] T062 [P] [US3] Write test: PUT /api/v1/toggles/{key} updates feature toggle state in apps/lab-api/src/test/java/com/distributedlab/labapi/controller/ToggleControllerTest.java

### Implementation for User Story 3

- [ ] T063 [P] [US3] Create catalog-service from \_template with catalog domain extracted from monolith in services/catalog-service/
- [ ] T064 [US3] Configure Envoy proxy with dynamic route redirects in infra/proxy/envoy.yaml
- [ ] T065 [US3] Implement StranglerFigService in Lab API to update Envoy config via REST in apps/lab-api/src/main/java/com/distributedlab/labapi/service/StranglerFigService.java
- [ ] T066 [US3] Implement ParallelRunService that fires requests to both monolith and catalog-service in apps/lab-api/src/main/java/com/distributedlab/labapi/service/ParallelRunService.java
- [ ] T067 [US3] Implement FeatureToggleController (GET/PUT /api/v1/toggles) backed by Redis in apps/lab-api/src/main/java/com/distributedlab/labapi/controller/ToggleController.java
- [ ] T068 [US3] Implement Labs page with ModuleCard components and module detail panel (select → configure → run → observe pattern) in apps/control-panel/src/app/labs/page.tsx (replaces T043 placeholder)
- [ ] T069 [US3] Implement StranglerFig experiment form (source route, target service, traffic %) in apps/control-panel/src/components/StranglerFigForm.tsx
- [ ] T070 [US3] Implement ParallelRun diff viewer component (side-by-side JSON comparison) in apps/control-panel/src/components/DiffViewer.tsx
- [ ] T071 [US3] Implement FeatureToggle dashboard component in apps/control-panel/src/components/FeatureTogglePanel.tsx
- [ ] T072 [US3] Add lab scenario definitions for Module 01 in labs/01-migration/
- [ ] T073 [US3] Write Pact contract test between monolith and catalog-service for catalog API in services/catalog-service/src/test/java/com/distributedlab/catalog/contract/

**Checkpoint**: Migration Lab fully functional — Strangler Fig redirects, parallel run diffs, feature toggles all work from the control panel

---

## Phase 6: User Story 4 - Explore Data Consistency (Priority: P2)

**Goal**: Learners can visualize CAP partition behavior, simulate replication lag, explore multi-model data, and run CDC pipelines

**Independent Test**: Navigate Labs → Module 02, cut network link in CAP visualizer, observe C vs. A behavior; run CDC pipeline and pause/replay events

### Tests for User Story 4

- [ ] T074 [P] [US4] Write test: CAP partition experiment starts and reports consistency/availability choice in apps/lab-api/src/test/java/com/distributedlab/labapi/service/CapSimulatorTest.java
- [ ] T075 [P] [US4] Write test: replication lag slider updates artificial delay in apps/lab-api/src/test/java/com/distributedlab/labapi/service/ReplicationLagServiceTest.java

### Implementation for User Story 4

- [ ] T076 [US4] Create kv-store service from \_template for two-node CAP simulation in services/kv-store/
- [ ] T077 [US4] Implement CapSimulatorService with network partition logic in apps/lab-api/src/main/java/com/distributedlab/labapi/service/CapSimulatorService.java
- [ ] T078 [US4] Implement ReplicationLagService with configurable PostgreSQL logical replication delay in apps/lab-api/src/main/java/com/distributedlab/labapi/service/ReplicationLagService.java
- [ ] T079 [P] [US4] Configure PostgreSQL leader-follower replication in docker-compose.yml
- [ ] T080 [P] [US4] Add MongoDB and Neo4j containers in docker-compose.yml
- [ ] T081 [US4] Implement CapVisualizer component (two-node SVG with partition toggle) in apps/control-panel/src/components/CapVisualizer.tsx
- [ ] T082 [US4] Implement ReplicationLagSlider component with real-time violation display in apps/control-panel/src/components/ReplicationLagSlider.tsx
- [ ] T083 [US4] Implement MultiModelExplorer component comparing query results from PostgreSQL, MongoDB, Neo4j in apps/control-panel/src/components/MultiModelExplorer.tsx
- [ ] T084 [US4] Implement MultiModelService to run same business queries against PostgreSQL, MongoDB, Neo4j and return latency/schema comparison in apps/lab-api/src/main/java/com/distributedlab/labapi/service/MultiModelService.java
- [ ] T085 [P] [US4] Add Elasticsearch container and Debezium connector config for CDC pipeline in docker-compose.yml and infra/cdc/debezium-connector.json
- [ ] T086 [US4] Implement CdcPipelineService (pause, replay, corrupt events) controlling Debezium → Kafka → Elasticsearch in apps/lab-api/src/main/java/com/distributedlab/labapi/service/CdcPipelineService.java
- [ ] T087 [US4] Implement CdcPipeline component with pause/replay/corrupt controls and event stream visualization in apps/control-panel/src/components/CdcPipeline.tsx
- [ ] T088 [US4] Implement ConsistencyLab page combining CAP visualizer, lag simulator, multi-model explorer, and CDC pipeline (select → configure → run → observe) in apps/control-panel/src/app/labs/consistency/page.tsx
- [ ] T089 [US4] Add lab scenario definitions for Module 02 in labs/02-consistency/

**Checkpoint**: Data Consistency Lab works — CAP visualizer, replication lag, multi-model explorer, and CDC pipeline all functional

---

## Phase 7: User Story 5 - Inject Chaos & Observe Resilience (Priority: P3)

**Goal**: Learners can inject faults and watch circuit breakers and bulkheads operate in real time

**Independent Test**: Navigate Chaos, inject +200ms latency into payment-service, verify circuit breaker opens and cascading failure map highlights degraded service

### Tests for User Story 5

- [ ] T090 [P] [US5] Write test: POST /api/v1/faults injects latency via Toxiproxy in apps/lab-api/src/test/java/com/distributedlab/labapi/controller/FaultControllerTest.java
- [ ] T091 [P] [US5] Write test: circuit breaker state transitions push via WebSocket in apps/lab-api/src/test/java/com/distributedlab/labapi/controller/CircuitBreakerWebSocketTest.java

### Implementation for User Story 5

- [ ] T092 [US5] Implement FaultService with Toxiproxy integration (latency, packet_loss, kill, memory, partition) in apps/lab-api/src/main/java/com/distributedlab/labapi/service/FaultService.java
- [ ] T093 [US5] Add Resilience4j circuit breaker and bulkhead dependencies; configure for payment-service, order-service, catalog-service in apps/lab-api/src/main/java/com/distributedlab/labapi/config/Resilience4jConfig.java
- [ ] T094 [US5] Implement CircuitBreakerController (GET /api/v1/circuit-breakers) in apps/lab-api/src/main/java/com/distributedlab/labapi/controller/CircuitBreakerController.java
- [ ] T095 [US5] Implement Chaos page with fault injection form, active faults table, circuit breaker cards in apps/control-panel/src/app/chaos/page.tsx (replaces T044 placeholder)
- [ ] T096 [US5] Implement FaultInjectionForm component (type, target, duration, magnitude selects) in apps/control-panel/src/components/FaultInjectionForm.tsx
- [ ] T097 [US5] Implement CircuitBreakerCard component with state visualization (closed/open/half_open) in apps/control-panel/src/components/CircuitBreakerCard.tsx
- [ ] T098 [US5] Implement CascadingFailureMap component (SVG topology with degraded/failed highlights) in apps/control-panel/src/components/CascadingFailureMap.tsx
- [ ] T099 [US5] Add lab scenario definitions for Module 03 in labs/03-chaos/

**Checkpoint**: Chaos Console fully functional — fault injection, circuit breaker + bulkhead visualization, cascading failure map all work

---

## Phase 8: User Story 6 - Visualize Sagas, Test Idempotency & Communication (Priority: P3)

**Goal**: Learners can run orchestrated and choreographed sagas, test idempotency, compare REST/gRPC/Kafka, and run contract tests

**Independent Test**: Navigate Labs → Module 04, run choreographed saga, verify real-time message flow map; compare REST vs gRPC vs Kafka latency

### Tests for User Story 6

- [ ] T100 [P] [US6] Write test: POST /api/v1/sagas/start creates a choreographed saga instance in apps/lab-api/src/test/java/com/distributedlab/labapi/controller/SagaControllerTest.java
- [ ] T101 [P] [US6] Write test: idempotency replay detects duplicate processing in services/order-service/src/test/java/com/distributedlab/order/

### Implementation for User Story 6

- [ ] T102 [P] [US6] Create order-service from \_template with Kafka consumer/producer in services/order-service/
- [ ] T103 [P] [US6] Create payment-service from \_template with idempotency-key mechanism in services/payment-service/
- [ ] T104 [US6] Implement SagaService with orchestrated and choreographed execution in apps/lab-api/src/main/java/com/distributedlab/labapi/service/SagaService.java
- [ ] T105 [US6] Implement SagaController (POST /api/v1/sagas/start, GET /api/v1/sagas/{id}) in apps/lab-api/src/main/java/com/distributedlab/labapi/controller/SagaController.java
- [ ] T106 [US6] Implement CommunicationLabService comparing REST, gRPC, Kafka for the same interaction with latency/throughput metrics in apps/lab-api/src/main/java/com/distributedlab/labapi/service/CommunicationLabService.java
- [ ] T107 [US6] Deploy Pact Broker container and publish initial consumer contracts in docker-compose.yml and infra/cdc/pact-broker-config.yml
- [ ] T108 [US6] Implement SagaVisualizer component with real-time message flow SVG in apps/control-panel/src/components/SagaVisualizer.tsx
- [ ] T109 [US6] Implement IdempotencyTester component with replay button and result verification in apps/control-panel/src/components/IdempotencyTester.tsx
- [ ] T110 [US6] Implement CommunicationComparison component showing REST vs gRPC vs Kafka latency/throughput side-by-side in apps/control-panel/src/components/CommunicationComparison.tsx
- [ ] T111 [US6] Implement WorkflowLab page combining saga visualizer, idempotency tester, and communication lab (select → configure → run → observe) in apps/control-panel/src/app/labs/workflows/page.tsx
- [ ] T112 [US6] Write Pact contract test between order-service and payment-service in services/order-service/src/test/java/com/distributedlab/order/contract/
- [ ] T113 [US6] Add lab scenario definitions for Module 04 in labs/04-workflows/

**Checkpoint**: Workflow Lab fully functional — saga visualization, idempotency testing, communication comparison, and Pact contract testing all work

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, CI, and community readiness

- [ ] T114 [P] Implement responsive sidebar collapse at 860px breakpoint in apps/control-panel/src/components/Sidebar.tsx
- [ ] T115 [P] Implement toast notification component per ui-design-system.md in apps/control-panel/src/components/Toast.tsx
- [ ] T116 [P] Create GitHub Actions CI workflow (build + test + compose health check) in .github/workflows/ci.yml
- [ ] T117 [P] Write contributor guide with lab scenario plugin contract in docs/CONTRIBUTING.md
- [ ] T118 [P] Write README.md with project overview, quickstart, and architecture diagram in README.md
- [ ] T119 Validate docker-compose.yml starts full stack within 120s on 8GB RAM machine
- [ ] T120 Run quickstart.md validation: verify all commands and URLs work as documented

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–8)**: All depend on Foundational phase completion
  - US1 + US2 (Phase 3–4): Can proceed immediately after Foundational
  - US3 (Phase 5): Depends on US1 (needs running stack for proxy testing)
  - US4 (Phase 6): Depends on US1 (needs running stack for data services)
  - US5 (Phase 7): Depends on US2 (needs service monitoring for chaos observation)
  - US6 (Phase 8): Depends on US3 (requires order-service and payment-service)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — No dependencies on other stories
- **US2 (P1)**: Can start after Foundational — No dependencies on other stories
- **US3 (P2)**: Depends on US1 (requires running Docker stack with monolith + proxy)
- **US4 (P2)**: Depends on US1 (requires running Docker stack with PostgreSQL)
- **US5 (P3)**: Depends on US2 (requires service monitoring and event feed)
- **US6 (P3)**: Depends on US3 (requires order-service and payment-service)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before services
- Services before controllers
- Controllers before UI components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Phase 1 tasks marked [P] can run in parallel
- All Phase 2 observability tasks (T007–T010) can run in parallel
- All Phase 2 monolith domain tasks (T027, T028) can run in parallel
- US1 and US2 can start in parallel after Foundational
- US3 and US4 can start in parallel (both depend only on US1)
- Within each story, all test tasks can run in parallel
- Within each story, all [P] model/component tasks can run in parallel

---

## Parallel Example: User Story 1

```text
# Launch tests together:
Task: "T038 [P] [US1] Write integration test: docker compose health check"
Task: "T039 [P] [US1] Write test: control panel page loads"

# Then launch page implementations in parallel:
Task: "T042 [US1] Dashboard placeholder page"
Task: "T043 [US1] Labs placeholder page"
Task: "T044 [US1] Chaos placeholder page"
Task: "T045 [US1] Registry placeholder page"
```

## Parallel Example: User Story 4 (refined)

```text
# Launch infrastructure tasks together:
Task: "T079 [P] [US4] Configure PostgreSQL leader-follower replication"
Task: "T080 [P] [US4] Add MongoDB and Neo4j containers"
Task: "T085 [P] [US4] Add Elasticsearch and Debezium for CDC"

# Then launch UI components in parallel:
Task: "T081 [US4] CapVisualizer component"
Task: "T082 [US4] ReplicationLagSlider component"
Task: "T083 [US4] MultiModelExplorer component"
Task: "T087 [US4] CdcPipeline component"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run `docker compose up`, verify all containers healthy
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 (Phase 3) → Test independently → Docker stack works (MVP!)
3. Add US2 (Phase 4) → Test independently → Dashboard shows real-time data
4. Add US3 (Phase 5) → Test independently → Migration Lab works
5. Add US4 (Phase 6) → Test independently → Data Consistency Lab works
6. Add US5 (Phase 7) → Test independently → Chaos Console works
7. Add US6 (Phase 8) → Test independently → Workflow Lab works
8. Polish (Phase 9) → CI, docs, contributor guide

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All UI components MUST follow contracts/ui-design-system.md
- All REST endpoints MUST follow contracts/lab-api.md
- All WebSocket events MUST follow contracts/websocket.md
- OTel instrumentation is baked into \_template (T011) per Constitution V "from creation"
- Pact contract tests are included per Constitution II mandate
