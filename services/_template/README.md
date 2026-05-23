# Template Service

Skeleton service for creating new DistributedLab sandbox services.

## Creating a New Service

```bash
# 1. Copy this template
cp -r services/_template services/my-new-service

# 2. Update the following files:
#    - pom.xml: Change artifactId and name
#    - src/main/resources/application.yml: Change server.port and spring.application.name
#    - Dockerfile: Update OTEL_RESOURCE_ATTRIBUTES service.name, EXPOSE port
#    - Rename package: com.distributedlab.template → com.distributedlab.myservice

# 3. Add the module to the parent pom.xml <modules> section

# 4. Add the service to docker-compose.yml with health check and memory limits
```

## What's Included

- Spring Boot 3 with Web and Actuator starters
- OpenTelemetry Java agent (auto-instrumentation)
- Prometheus metrics endpoint at `/actuator/prometheus`
- Structured JSON logging with trace/span correlation
- Health check endpoint at `/actuator/health`
- Dockerfile with OTel agent and health check

## Running

```bash
# Build
cd services/my-new-service
mvn package

# Run with OTel agent
java -javaagent:target/dependency/opentelemetry-javaagent.jar \
     -jar target/*.jar
```
