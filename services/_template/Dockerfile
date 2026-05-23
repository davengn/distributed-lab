FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY target/dependency/opentelemetry-javaagent.jar /app/opentelemetry-javaagent.jar
COPY target/*.jar /app/service.jar

ENV JAVA_TOOL_OPTIONS="-javaagent:/app/opentelemetry-javaagent.jar"
ENV OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
ENV OTEL_RESOURCE_ATTRIBUTES=service.name=template-service
ENV OTEL_TRACES_EXPORTER=otlp
ENV OTEL_METRICS_EXPORTER=otlp
ENV OTEL_LOGS_EXPORTER=otlp

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "/app/service.jar"]
