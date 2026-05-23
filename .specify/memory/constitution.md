<!--
Sync Impact Report
==================
Version change: N/A → 1.0.0
Modified principles: N/A (initial creation)
Added sections:
  - Core Principles (I–V)
  - Technology Stack & Constraints
  - Development Workflow & Quality Gates
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ compatible (Constitution Check section present)
  - .specify/templates/spec-template.md: ✅ compatible (Requirements structure aligns)
  - .specify/templates/tasks-template.md: ✅ compatible (Phase/test structure aligns)
Follow-up TODOs: None
-->

# DistributedLab Constitution

## Core Principles

### I. Code Quality & Service Boundaries

- Every feature MUST maintain clear service boundaries per the monorepo structure
- Services MUST be independently buildable and deployable
- The `_template` skeleton service MUST be used as the starting point for all new services
- No shared database schemas between services; each service owns its data
- API contracts MUST be defined before implementation begins
- Code MUST follow consistent formatting enforced by automated linters (Java: Checkstyle; TypeScript: ESLint + Prettier)
- No bare print statements or console.log in production codepaths — use structured logging

### II. Test-First Development (NON-NEGOTIABLE)

- TDD is mandatory: write tests → confirm they fail → then implement
- Red-Green-Refactor cycle is strictly enforced for all new features
- Every service MUST include:
  - Unit tests for business logic
  - Integration tests for service contracts and data access
  - Contract tests (Pact) for inter-service communication
- Docker Compose health checks MUST pass before any experiment is considered complete
- Test coverage MUST NOT decrease on any pull request

### III. User Experience Consistency

- `docker compose up` MUST be the only prerequisite to start the platform
- UI labels MUST reference the originating distributed-systems concept (e.g., "Strangler Fig"), never the implementation tool (e.g., "Envoy route config")
- Dark/light mode MUST be supported across every UI screen
- Real-time updates via WebSocket MUST be used for live experiment data (metrics, traces, fault status)
- The control panel MUST maintain consistent navigation, layout patterns, and status-pill conventions across all views
- Error states MUST be surfaced visually with actionable messages
- All lab modules MUST follow the same interaction pattern: select → configure → run → observe

### IV. Performance & Resource Standards

- The full Docker Compose stack MUST start within 120 seconds on a machine with 8 GB RAM and 4 CPU cores
- Control panel API response times MUST remain under 500 ms (p95) for standard operations
- Real-time data (metrics, traces, fault status) MUST update in the UI within 2 seconds of occurrence
- The control panel MUST remain responsive when multiple experiments run concurrently
- Memory limits MUST be explicitly set on all containers in docker-compose.yml
- No single sandbox container MAY consume more than 2 GB RAM under normal operation

### V. Observability-First Engineering

- Every experiment MUST produce observable signal (metrics, logs, or distributed traces)
- The observability stack (Prometheus, Grafana, Jaeger, Loki) MUST ship pre-configured and require zero learner configuration
- All services MUST include OpenTelemetry instrumentation from creation
- Structured logging MUST be used across all services — no unstructured log output
- Correlation IDs MUST be propagated across all service boundaries
- The observability stack is NEVER optional; it is the "paved road" for all labs

## Technology Stack & Constraints

- **Control Panel**: Next.js 16 (App Router) + Tailwind CSS + Recharts/D3
- **Lab API**: Spring Boot 3 (Java 21) + Docker Java SDK + Resilience4j
- **Sandbox Services**: Spring Boot microservices + Kafka + Debezium + Pact Broker + Toxiproxy
- **Storage**: PostgreSQL 16, MongoDB 7, Neo4j 5, Redis 7, Apache Kafka
- **Observability**: Prometheus, Grafana, Jaeger (OpenTelemetry), Loki + Promtail, Backstage
- **Infrastructure**: Docker Compose (v1 target), GitHub Actions CI
- **Monorepo**: pnpm (frontend) + Maven (backend)
- **License**: MIT

The Docker socket is mounted read-write into the Lab API container for fault injection. The sandbox MUST NEVER run on a production host or with untrusted users.

## Development Workflow & Quality Gates

- All pull requests MUST pass CI (build + test + compose health check) before merge
- All pull requests MUST verify compliance with this constitution
- New lab modules MUST follow the lab scenario plugin contract defined in the `labs/` directory
- Feature branches MUST follow the naming convention: `###-feature-name`
- Commits SHOULD reference the task ID from `tasks.md` where applicable
- Complexity beyond what these principles permit MUST be justified in the plan's Complexity Tracking section

## Governance

This constitution supersedes all other development practices and conventions.

Amendments MUST include: (1) documentation of the proposed change, (2) maintainer approval, and (3) a migration plan for any existing code affected by the change.

Version bumps follow semantic versioning:

- **MAJOR**: Principle removal or backward-incompatible redefinition
- **MINOR**: New principle added or materially expanded guidance
- **PATCH**: Clarifications, wording improvements, non-semantic refinements

All pull requests and code reviews MUST verify compliance with these principles. Any deviation MUST be documented and justified.

**Version**: 1.0.0 | **Ratified**: 2026-05-23 | **Last Amended**: 2026-05-23
