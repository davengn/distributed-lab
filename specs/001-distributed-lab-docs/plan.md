# Implementation Plan: DistributedLab Platform

**Branch**: `001-distributed-lab-docs` | **Date**: 2026-05-23 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-distributed-lab-docs/spec.md`

## Summary

DistributedLab is a self-hosted, open-source learning sandbox for distributed systems and microservices concepts. It runs entirely via Docker Compose and provides a Next.js control panel that orchestrates experiments across five lab modules: Migration & Decomposition, Data Consistency, Resiliency & Chaos, Workflow & Communication, and Observability. The platform targets individual learners and the developer community, requiring no cloud account or manual configuration.

The technical approach follows a monorepo structure with a Next.js frontend (control panel), Spring Boot backend (Lab API + sandbox services), and Docker Compose infrastructure. The observability stack (Prometheus, Grafana, Jaeger, Loki) ships pre-configured as the "paved road" for all labs.

## Technical Context

**Language/Version**: Java 21 (Spring Boot 3), TypeScript (Next.js 16 / App Router)

**Primary Dependencies**: Spring Boot 3, Next.js 16, Tailwind CSS, Recharts/D3, Docker Java SDK, Resilience4j, Kafka (Confluent), Debezium, Toxiproxy, Pact Broker, OpenTelemetry

**Storage**: PostgreSQL 16, MongoDB 7, Neo4j 5, Redis 7, Apache Kafka, Elasticsearch (read model for CDC)

**Testing**: JUnit 5 + Mockito (Java), Jest + React Testing Library (TypeScript), Pact (contract tests), Docker Compose health checks (integration)

**Target Platform**: Local development machine (macOS, Linux, Windows with WSL2) with Docker Compose

**Project Type**: Web application (frontend + backend + infrastructure), monorepo

**Performance Goals**: 120s cold start, <500ms API p95, <2s real-time UI updates, responsive under concurrent experiments

**Constraints**: <2GB RAM per container, Docker socket read-write mounted (sandbox only), no cloud dependencies for v1

**Scale/Scope**: 5 lab modules, 6+ sandbox services, 1 monolith, 1 control panel, 1 Lab API, full observability stack — targeting a single learner on a local machine

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                            | Gate                                                                                                                                  | Status |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| I. Code Quality & Service Boundaries | Services are independently buildable in the monorepo; `_template` skeleton provided; linters configured (Checkstyle, ESLint+Prettier) | PASS   |
| II. Test-First Development           | TDD enforced; unit + integration + contract tests required per service; Docker Compose health checks required                         | PASS   |
| III. User Experience Consistency     | One-command start; concept-first naming; dark/light mode; consistent UI patterns; WebSocket real-time updates                         | PASS   |
| IV. Performance & Resource Standards | 120s startup; <500ms p95; <2s real-time; memory limits on all containers; <2GB per container                                          | PASS   |
| V. Observability-First Engineering   | Pre-configured Prometheus/Grafana/Jaeger/Loki; OpenTelemetry on all services; structured logging; correlation IDs                     | PASS   |

All gates PASS. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-distributed-lab-docs/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── lab-api.md       # Lab API REST endpoints
│   ├── control-panel.md # Control panel ↔ Lab API contract
│   └── websocket.md     # WebSocket event protocol
└── tasks.md             # Phase 2 output (NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
distributed-lab/
├── apps/
│   ├── control-panel/          # Next.js UI (App Router, Tailwind, WebSocket)
│   │   ├── src/
│   │   │   ├── app/            # Pages: dashboard, labs, chaos, registry
│   │   │   ├── components/     # Shared UI components (StatusPill, MetricCard, etc.)
│   │   │   ├── hooks/          # WebSocket hooks, data fetching hooks
│   │   │   ├── lib/            # API client, WebSocket client, utils
│   │   │   └── styles/         # Tailwind config, global styles, CSS variables
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   └── integration/
│   │   ├── package.json
│   │   └── next.config.js
│   └── lab-api/                # Spring Boot Lab API
│       ├── src/main/java/
│       │   └── com/distributedlab/labapi/
│       │       ├── controller/  # REST + WebSocket controllers
│       │       ├── service/     # Docker socket, Toxiproxy, experiment mgmt
│       │       ├── model/       # Entities: Experiment, Fault, ServiceInfo
│       │       ├── config/      # WebSocket, OTel, Resilience4j config
│       │       └── client/      # Docker Java SDK, Toxiproxy client
│       ├── src/test/java/
│       │   ├── unit/
│       │   ├── integration/
│       │   └── contract/
│       └── pom.xml
├── services/
│   ├── monolith/               # MusicCorp monolith (Spring Boot)
│   │   ├── src/main/java/
│   │   │   └── com/distributedlab/monolith/
│   │   │       ├── catalog/    # Catalog domain
│   │   │       ├── order/      # Order domain
│   │   │       └── payment/    # Payment domain
│   │   └── pom.xml
│   ├── catalog-service/        # Extracted catalog microservice
│   ├── order-service/          # Order microservice
│   ├── payment-service/        # Payment microservice
│   └── _template/              # Skeleton service (OTel, health, logging)
│       └── README.md           # How to create a new service from template
├── infra/
│   ├── proxy/                  # Envoy / Nginx Strangler Fig config
│   │   ├── envoy.yaml
│   │   └── nginx-strangler.lua
│   ├── observability/          # Prometheus, Grafana, Jaeger, Loki configs
│   │   ├── prometheus.yml
│   │   ├── grafana/            # Dashboard JSON files
│   │   ├── jaeger/             # OTel collector config
│   │   └── loki/               # Promtail config
│   └── chaos/                  # Toxiproxy, Chaos Toolkit scenarios
│       └── toxiproxy.json
├── labs/
│   ├── 01-migration/           # Migration lab scenarios
│   ├── 02-consistency/         # Data consistency experiments
│   ├── 03-chaos/               # Chaos engineering scenarios
│   ├── 04-workflows/           # Saga and messaging experiments
│   └── 05-observability/       # Observability guided tour
├── docs/                       # Concept guides, screenshots, contributor guide
├── docker-compose.yml          # Full stack
├── docker-compose.dev.yml      # Dev overrides (hot reload, debug ports)
├── docker-compose.test.yml     # CI test overrides (health checks, assertions)
├── pnpm-workspace.yaml         # Frontend workspace
└── README.md
```

**Structure Decision**: Web application with `apps/` for the two main applications (control panel + Lab API), `services/` for sandbox microservices, `infra/` for infrastructure configuration, and `labs/` for lab scenario definitions. This follows the monorepo pattern described in the product specification.

## Complexity Tracking

> No constitution violations detected. All gates PASS.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | N/A                                  |
