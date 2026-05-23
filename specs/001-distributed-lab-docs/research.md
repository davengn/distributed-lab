# Research: DistributedLab Platform

**Date**: 2026-05-23 | **Feature**: DistributedLab Platform

## Architecture Decisions

### 1. Monorepo Structure with pnpm + Maven

**Decision**: Use a monorepo with pnpm workspaces for the Next.js control panel and Maven multi-module for the Spring Boot services.

**Rationale**: The spec requires one `git clone` to get everything. pnpm workspaces handle the single Next.js app cleanly; Maven multi-module allows each Spring Boot service to be independently buildable while sharing parent POM configuration (dependencies, plugins, Checkstyle). This avoids the complexity of Gradle or Bazel for a project of this scope.

**Alternatives considered**:

- Turborepo/Nx: Overkill for a single Next.js frontend app. Would add learning curve for contributors.
- Gradle multi-project: Less familiar to the Spring Boot community than Maven; adds complexity for the `_template` service onboarding.
- Separate repos: Violates the "one clone" principle and makes cross-service testing harder.

### 2. Docker Compose as the Sole Runtime

**Decision**: Use Docker Compose (v2 syntax, `docker compose` command) as the only runtime. No Kubernetes, no cloud deployment for v1.

**Rationale**: The target audience is individual learners on their own machines. Docker Compose is the simplest orchestrator that supports multi-service networking, resource limits, and health checks. It satisfies the "one command to start" principle without requiring cloud accounts or kubectl knowledge.

**Alternatives considered**:

- Kubernetes (minikube/kind): Too heavy for a learning sandbox. Adds conceptual overhead unrelated to the distributed systems concepts being taught.
- Testcontainers: Useful for CI testing of individual services but does not provide a persistent multi-service environment for learners.
- Podman Compose: Less common; Docker Compose has broader install base.

### 3. Next.js App Router for Control Panel

**Decision**: Use Next.js 16 with the App Router pattern and server components where possible.

**Rationale**: The App Router is the modern Next.js standard. Server components reduce client-side JavaScript for data fetching (Lab API calls). The control panel is primarily a read-heavy dashboard with real-time WebSocket updates, which maps well to the App Router's streaming and Suspense support.

**Alternatives considered**:

- Pages Router: Legacy pattern; App Router is recommended for new projects since Next.js 13.
- Vite + React: No SSR benefit; requires manual setup for code splitting and streaming.
- Remix: Viable but Next.js has larger community and more contributors are likely familiar with it.

### 4. Spring Boot 3 with Java 21 for Lab API and Services

**Decision**: Use Spring Boot 3.x with Java 21 (virtual threads) for the Lab API and all sandbox services.

**Rationale**: Spring Boot is the most widely used Java microservices framework. Java 21's virtual threads (Project Loom) simplify reactive patterns without the complexity of WebFlux. The Docker Java SDK and Resilience4j both have first-class Spring Boot integration.

**Alternatives considered**:

- Spring WebFlux: Adds reactive complexity that obscures the distributed systems concepts being taught.
- Quarkus: Smaller community; less familiar to the target audience.
- Go microservices: Different language adds friction for contributors and the spec explicitly calls for Spring Boot.

### 5. WebSocket (STOMP) for Real-Time Updates

**Decision**: Use STOMP over WebSocket via Spring's built-in WebSocket support for Lab API → Control Panel real-time updates.

**Rationale**: The Lab API needs to push experiment state changes, fault injection events, and metric updates to the control panel in real time. STOMP provides a simple pub/sub protocol on top of WebSocket. Spring's `@MessageMapping` and `SimpMessagingTemplate` make this straightforward.

**Alternatives considered**:

- Server-Sent Events (SSE): Unidirectional; cannot support future two-way interactions (e.g., experiment control from dashboard).
- Raw WebSocket: Requires custom framing and message parsing; STOMP provides this out of the box.
- Polling: Does not meet the <2s real-time update requirement.

### 6. Toxiproxy for Fault Injection

**Decision**: Use Toxiproxy (by Shopify) as the fault injection layer between services.

**Rationale**: Toxiproxy sits between services as a transparent proxy and can inject latency, bandwidth limits, packet loss, and connection timeouts. It has a simple REST API that the Lab API can call. It is lightweight, runs in Docker, and is purpose-built for chaos testing.

**Alternatives considered**:

- Chaos Toolkit: More focused on chaos engineering scenarios but heavier. Could be added later for advanced scenarios.
- tc netem (Linux traffic control): Requires privileged Docker containers and Linux-only; Toxiproxy is cross-platform.
- Custom fault injection: Reinventing the wheel; Toxiproxy is battle-tested.

### 7. OpenTelemetry for Observability

**Decision**: Use OpenTelemetry (OTel) as the instrumentation layer, with Jaeger as the trace backend, Prometheus for metrics, and Loki for logs.

**Rationale**: OpenTelemetry is vendor-neutral and becoming the industry standard. It provides a single instrumentation API for traces, metrics, and logs. The OTel Java agent auto-instruments Spring Boot services with zero code changes. The OTel Collector can export to Jaeger, Prometheus, and Loki simultaneously.

**Alternatives considered**:

- Micrometer + Brave: Spring-native but vendor-specific; OTel is more portable.
- Zipkin instead of Jaeger: Jaeger has better OTel integration and a richer UI.
- ELK stack for logs: Heavier than Loki; Loki indexes labels only, which is sufficient for this use case.

### 8. Feature Toggle Storage with Redis

**Decision**: Use Redis as the backing store for feature toggles in the Migration Lab.

**Rationale**: Redis is already in the stack (needed for Kafka and other services). It provides fast key-value access with pub/sub for real-time toggle change notifications. The Togglz library has a Redis backend for Spring Boot.

**Alternatives considered**:

- Database-backed toggles: Adds unnecessary database queries for what is essentially a hot key-value lookup.
- FF4j: Viable but Togglz has better Spring Boot integration and Redis support.
- Unleash: Requires running a separate Unleash server; overkill for the sandbox.

## Technology Best Practices

### Spring Boot Service Template (`_template`)

The `_template` service must include:

- Spring Boot 3 starter with Web, Actuator, OpenTelemetry
- Dockerfile using Eclipse Temurin Java 21 JRE base image
- `application.yml` with OTel exporter, Prometheus endpoint, Loki logback appender
- Health check endpoint (`/actuator/health`)
- Example REST controller with structured logging
- Maven POM inheriting from parent with Checkstyle, Surefire, Jacoco plugins

### Next.js Control Panel Patterns

- Use React Server Components for initial data loading (Dashboard metrics, service list)
- Use client-side WebSocket hook (`useWebSocket`) for real-time updates
- Implement dark/light mode via CSS variables on `:root` and `[data-theme="dark"]`
- Use Tailwind utility classes exclusively; no CSS modules
- Implement responsive breakpoints: 860px (sidebar collapse), 1100px (grid adjustments), 600px (single column)

### Docker Compose Configuration

- Use `depends_on` with `condition: service_healthy` for startup ordering
- Set `mem_limit` on all containers
- Use `healthcheck` directives for all services
- Use named volumes for persistent data (PostgreSQL, MongoDB, Neo4j, Redis)
- Use `.env` file for configurable ports and resource limits
- Use profiles for optional services (e.g., `--profile dev` for hot reload)

### Inter-Service Communication Patterns

- REST for synchronous request/response (control panel ↔ Lab API, Lab API ↔ services)
- Kafka for asynchronous event streaming (CDC pipeline, saga choreography)
- gRPC for the Communication Style Lab comparison (Module 04)
- WebSocket (STOMP) for real-time Lab API → Control Panel push

### 9. GitHub Primer Design System Adapted for Control Panel

**Decision**: Use the GitHub Primer design system (adapted) as the visual language for the control panel, implemented via CSS custom properties and Tailwind utility classes.

**Rationale**: Primer is a proven design system for developer-tool UIs — it prioritizes density, information-per-square-inch, and status-driven color semantics. This aligns with the control panel's identity as a monitoring/operations dashboard rather than a marketing page. The system-ui font stack avoids web font loading overhead, keeping the UI instant on every OS.

**Alternatives considered**:

- Material UI: Too opinionated with shadows, elevation, and rounded cards. Feels like a consumer app, not a developer tool.
- Ant Design: Similar density concerns but heavier component library; doesn't match the hairline-border aesthetic.
- Custom design system from scratch: Unnecessary when Primer already embodies the exact posture needed (density, no shadows, status-driven colors).
- Shadcn/ui + Tailwind: Viable for component scaffolding, but the brand spec's color tokens, type scale, and layout rules must override any defaults.

**Key brand rules enforced**:

- Hairline borders (1px `--border-default`), no drop shadows except on toasts
- 6px border-radius everywhere (except status pills at 9999px)
- One accent color (Primer blue) — no other element uses blue
- Status semantics: green=running, amber=degraded, red=failed, purple=completed
- Dark mode via single `data-theme="dark"` toggle on `<html>` — all tokens swap in one CSS block
- No custom web fonts; system-ui stack renders instantly

## Unresolved Items

None. All technical decisions are resolved based on the product specification and constitution principles.
