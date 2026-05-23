FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

COPY pom.xml .
COPY apps/lab-api/pom.xml apps/lab-api/
COPY services/monolith/pom.xml services/monolith/
COPY services/catalog-service/pom.xml services/catalog-service/
COPY services/order-service/pom.xml services/order-service/
COPY services/payment-service/pom.xml services/payment-service/
COPY services/_template/pom.xml services/_template/
COPY services/kv-store/pom.xml services/kv-store/

RUN mvn -pl apps/lab-api -am dependency:go-offline -B

COPY apps/lab-api/src apps/lab-api/src
RUN mvn -pl apps/lab-api -am package -DskipTests -B -Dcheckstyle.skip=true

RUN wget -qO opentelemetry-javaagent.jar \
    https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/download/v2.13.3/opentelemetry-javaagent.jar

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /build/apps/lab-api/target/*.jar service.jar
COPY --from=builder /build/opentelemetry-javaagent.jar opentelemetry-javaagent.jar

ENV JAVA_TOOL_OPTIONS="-javaagent:/app/opentelemetry-javaagent.jar"
ENV OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
ENV OTEL_RESOURCE_ATTRIBUTES=service.name=lab-api
ENV OTEL_TRACES_EXPORTER=otlp
ENV OTEL_METRICS_EXPORTER=otlp
ENV OTEL_LOGS_EXPORTER=otlp

EXPOSE 3001

HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:3001/actuator/health || exit 1

VOLUME /var/run/docker.sock

ENTRYPOINT ["java", "-jar", "/app/service.jar"]
