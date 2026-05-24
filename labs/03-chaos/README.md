# Module 03 -- Chaos Engineering

This module covers chaos engineering techniques using the DistributedLab
platform. You will inject faults, observe circuit breakers, and trace cascading
failures across the microservice topology.

---

## Scenario 1 -- Latency Injection

**Objective:** Inject network latency into a service dependency and observe how
the system degrades under slow responses.

**Steps:**

1. Open the Control Panel at `http://localhost:3000/chaos`.
2. In the fault injection form, select **Latency** as the type and
   **payment-service** as the target.
3. Set the magnitude to `500ms` and duration to `120s`.
4. Click **Inject Fault**.
5. In a separate terminal, send repeated requests to the order endpoint:
   ```bash
   for i in $(seq 1 20); do
     curl -s -o /dev/null -w "%{http_code} %{time_total}s\n" \
       http://localhost:8000/api/orders
   done
   ```
6. Watch the Circuit Breakers panel. After enough failed/slow calls the
   payment-service breaker should transition from **Closed** to **Open**.
7. Observe the Cascading Failure Map: the payment-service node turns
   *degraded*, and connections to it switch from solid to dashed lines.

**Rollback:** Click the remove button on the active fault, or wait for the
duration to expire. The circuit breaker transitions to **Half-Open** and then
back to **Closed** once healthy calls resume.

**Observability:** Traces in Jaeger show increased latency on the
payment-service span. Grafana dashboards show elevated p99 latency and error
rate spikes.

---

## Scenario 2 -- Packet Loss Simulation

**Objective:** Simulate unreliable network conditions by dropping packets
between services, then verify that retries and timeouts behave correctly.

**Steps:**

1. In the fault injection form, select **Packet Loss** as the type and
   **catalog-service** as the target.
2. Set the magnitude to `30%` and duration to `90s`.
3. Click **Inject Fault**.
4. Send repeated requests to the catalog endpoint:
   ```bash
   for i in $(seq 1 30); do
     curl -s -o /dev/null -w "%{http_code}\n" \
       http://localhost:8000/api/catalog
   done
   ```
5. Observe a mix of 200 and 503/504 responses in the output.
6. Check the Cascading Failure Map: the catalog-service connection shows a
   dashed orange line indicating degraded connectivity.

**Rollback:** Remove the fault from the Active Faults list. Packet loss stops
immediately.

**Observability:** Jaeger traces show intermittent `connection reset` or
`timeout` errors on catalog-service spans. The circuit breaker failure count
increments on each unsuccessful call.

---

## Scenario 3 -- Cascading Failure Walk

**Objective:** Trigger a cascading failure by making a critical downstream
service unavailable, then observe how failure propagates through the call chain.

**Steps:**

1. Inject a **Kill** fault on **payment-service** with a duration of `60s`.
2. Immediately send traffic to the order flow:
   ```bash
   curl -X POST http://localhost:8000/api/orders \
     -H "Content-Type: application/json" \
     -d '{"itemId": "item-001", "quantity": 1}'
   ```
3. Observe the Cascading Failure Map:
   - payment-service turns **failed** (red, dashed border).
   - The connection from order-service to payment-service turns dashed red.
   - order-service transitions to **degraded** (yellow) as its calls fail.
4. Watch the Circuit Breakers panel: the payment-service breaker opens, then
   the order-service breaker opens due to its dependency on payment-service.
5. After the fault expires, observe recovery:
   - payment-service returns to **healthy**.
   - Breakers transition to **Half-Open**, then **Closed**.
   - The map returns to all-solid borders.

**Rollback:** Wait for the kill fault duration to expire, or manually remove
the fault. Services recover automatically.

**Observability:** Jaeger shows the full chain: order-service -> payment-service
with error spans highlighted. Grafana shows correlated error spikes across
both services.

---

## Scenario 4 -- Network Partition

**Objective:** Simulate a network partition that isolates a service, then
observe how the system handles complete isolation.

**Steps:**

1. Inject a **Partition** fault on **order-service** with a duration of `60s`.
2. Attempt to place orders:
   ```bash
   curl -X POST http://localhost:8000/api/orders \
     -H "Content-Type: application/json" \
     -d '{"itemId": "item-002", "quantity": 2}'
   ```
3. Observe the Cascading Failure Map: order-service is fully isolated with no
   connections visible (all edges show dashed red).
4. Verify that the catalog-service remains reachable and responsive:
   ```bash
   curl http://localhost:8000/api/catalog
   ```

**Rollback:** Remove the partition fault. Connectivity restores immediately and
the circuit breaker enters half-open state.

**Observability:** Traces show `connection refused` or `no route to host` for
order-service spans. Catalog-service traces remain healthy, demonstrating
failure isolation between independent service domains.
