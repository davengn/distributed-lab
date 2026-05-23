# Module 05: Observability Suite

## Overview

Guided tour through the DistributedLab observability stack: Prometheus, Grafana, Jaeger, and Loki. Learners explore metrics, traces, and logs in context of running experiments.

## Scenarios

### Scenario 1: Metric Dashboard Tour

**Objective**: Understand what metrics are available and how they're collected.

**Steps**:
1. Open Grafana at http://localhost:3001/grafana (admin/admin)
2. Navigate to the pre-built DistributedLab dashboard
3. Identify CPU, memory, request rate, and error rate metrics
4. Observe how metrics change when load is applied

**Concepts**: Time-series metrics, PrometheusQL, scrape targets

### Scenario 2: Distributed Trace Exploration

**Objective**: Follow a request across multiple services using Jaeger traces.

**Steps**:
1. Open Jaeger at http://localhost:16686
2. Select "monolith" service and find recent traces
3. Expand a trace to see individual spans
4. Identify the correlation ID propagation pattern
5. Compare latency across service boundaries

**Concepts**: Distributed tracing, span context, correlation IDs, OpenTelemetry

### Scenario 3: Structured Log Analysis

**Objective**: Use Loki to search and filter structured logs.

**Steps**:
1. Open Grafana Explore tab
2. Select Loki as data source
3. Query logs by service: `{container="monolith"}`
4. Filter by level: `{container="monolith"} |="ERROR"`
5. Search for a specific trace ID to correlate logs with traces

**Concepts**: Structured logging, log aggregation, label-based queries

### Scenario 4: Full Observability Correlation

**Objective**: Correlate metrics, traces, and logs for a single incident.

**Steps**:
1. Inject latency into payment-service via Chaos Console
2. Watch the metric spike in Grafana dashboard
3. Find the slow traces in Jaeger
4. Search for error logs in Loki by trace ID
5. Remove the fault and observe recovery

**Concepts**: The three pillars of observability, incident correlation, MTTR
