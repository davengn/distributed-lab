# Quickstart: DistributedLab Development

## Prerequisites

- **Docker** 24+ and **Docker Compose** v2 (check: `docker compose version`)
- **Node.js** 20+ and **pnpm** 9+ (for control panel development)
- **Java** 21 (JDK) and **Maven** 3.9+ (for Lab API and service development)
- **Git** 2.40+

## Clone & Start

```bash
git clone https://github.com/davengn/distributed-lab.git
cd distributed-lab
docker compose up
```

Wait for all containers to report healthy (typically 60–120 seconds). Then open:

- **Control Panel**: http://localhost:3000
- **Grafana**: http://localhost:3001/grafana (admin/admin)
- **Jaeger**: http://localhost:16686
- **Prometheus**: http://localhost:9090

## Development Mode

For hot-reload during development:

```bash
# Start infrastructure only (databases, Kafka, observability)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Control panel (hot reload on port 3000)
cd apps/control-panel
pnpm install
pnpm dev

# Lab API (debug mode on port 3001)
cd apps/lab-api
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Individual services
cd services/catalog-service
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## Project Structure

```
distributed-lab/
├── apps/control-panel/     # Next.js UI (pnpm)
├── apps/lab-api/           # Spring Boot Lab API (Maven)
├── services/               # Sandbox microservices (Maven)
├── infra/                  # Docker configs (proxy, observability, chaos)
├── labs/                   # Lab scenario definitions
└── docker-compose.yml      # Full stack orchestration
```

## Running Tests

```bash
# Control panel
cd apps/control-panel && pnpm test

# Lab API (unit + integration)
cd apps/lab-api && mvn verify

# All services (Maven multi-module from root)
mvn verify

# Contract tests (Pact)
mvn verify -pl services/order-service -P contract-tests

# Docker Compose health check (CI)
docker compose -f docker-compose.yml -f docker-compose.test.yml up --abort-on-container-exit
```

## Creating a New Service

```bash
# Copy the template
cp -r services/_template services/my-new-service

# Update in files:
# - pom.xml: artifactId, name
# - application.yml: server.port, service.name
# - Dockerfile: EXPOSE port

# Add to docker-compose.yml with health check and memory limits
```

## Key Ports

| Service | Port |
|---------|------|
| Control Panel (Next.js) | 3000 |
| Lab API (Spring Boot) | 3001 |
| Monolith | 8080 |
| Catalog Service | 8081 |
| Order Service | 8082 |
| Payment Service | 8083 |
| API Gateway (Envoy) | 8000 |
| Kafka | 9092 |
| PostgreSQL | 5432 |
| MongoDB | 27017 |
| Redis | 6379 |
| Prometheus | 9090 |
| Grafana | 3001 (sub-path) |
| Jaeger | 16686 |
