# Module 01 -- Incremental Migration

This module covers the three core strategies for incrementally migrating from a
monolith to microservices using the MusicCorp platform as the working example.

---

## Scenario 1 -- Strangler Fig Redirect

**Objective:** Route a single API path from the monolith to the new
catalog-service without any client-side changes.

**Steps:**

1. Deploy `catalog-service` alongside the running monolith.
2. Uncomment the `catalog-service` cluster block in `infra/proxy/envoy.yaml`.
3. Add the `/api/catalog` route redirect *above* the default catch-all route.
4. Reload Envoy (`docker compose restart proxy`).
5. Send requests to `http://localhost:8000/api/catalog` and verify they are
   served by the new catalog-service (check the `X-Envoy-Upstream-Service-Time`
   header or trace data in Jaeger).
6. Compare response bodies against the monolith to confirm parity.

**Rollback:** Remove the route entry and reload Envoy. Traffic immediately
falls back to the monolith.

**Observability:** Both services emit traces to the OTel collector. Use Jaeger
to confirm which upstream handled each request.

---

## Scenario 2 -- Parallel Run Comparison

**Objective:** Mirror production traffic to the new service while still serving
all requests from the monolith, allowing safe comparison without risk.

**Steps:**

1. Deploy `catalog-service` alongside the running monolith.
2. In `infra/proxy/envoy.yaml`, replace the Strangler Fig route for
   `/api/catalog` with a `request_mirror_policies` block (see the commented
   example at the top of envoy.yaml).
3. Set `runtime_fraction` to mirror 100 % of traffic initially; lower the
   percentage as confidence grows.
4. Reload Envoy.
5. Compare traces, logs, and metrics between the monolith responses and the
   mirrored catalog-service responses.
6. Look for status-code mismatches, latency regressions, or error spikes in
   Grafana.

**Rollback:** Remove the mirror policy and reload Envoy. No client impact at
any point.

**Observability:** The mirrored requests generate independent traces tagged
with `catalog-service`. Use Grafana dashboards to compare p50/p99 latencies
and error rates side by side.

---

## Scenario 3 -- Feature Toggle Flip

**Objective:** Switch the upstream for `/api/catalog` between the monolith and
the catalog-service at runtime using a feature flag, without restarting any
infrastructure component.

**Steps:**

1. Deploy `catalog-service` alongside the running monolith.
2. Add a feature-flag evaluation step in the Envoy route configuration (or
   use an external control plane / RDS endpoint) that reads a flag value to
   decide the upstream cluster.
3. Set the flag to `monolith` (default).
4. Verify all `/api/catalog` traffic hits the monolith.
5. Flip the flag to `catalog-service`.
6. Verify traffic now routes to the new service.
7. Flip back to `monolith` to confirm instant rollback.

**Rollback:** Toggle the feature flag back. Propagation is immediate.

**Observability:** Flag evaluation events can be emitted as custom spans. Watch
for the transition in Jaeger traces and confirm no requests are dropped during
the switch.
