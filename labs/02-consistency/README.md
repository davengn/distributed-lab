# Lab 02: Data Consistency

Explore the fundamental trade-offs in distributed data systems through interactive experiments.

## Prerequisites

- All platform services running (`docker compose up`)
- Control Panel accessible at http://localhost:3000
- Lab API accessible at http://localhost:8080

## Lab Scenarios

### Scenario 1: CAP Theorem in Practice

**Objective:** Experience the consistency vs. availability trade-off when a network partition occurs.

**Steps:**

1. Navigate to the Data Consistency Lab and select the "CAP Theorem" tab.
2. Observe two healthy kv-store nodes connected by a green line.
3. Click "Cut Network" to simulate a partition between nodes.
4. Choose a behavior:
   - **Consistency (C):** Nodes reject writes during the partition. Data remains consistent but the system is unavailable for writes.
   - **Availability (A):** Nodes accept writes independently. After healing, data may have diverged and requires reconciliation.
5. Write values to individual nodes during the partition.
6. Click "Heal Network" and observe whether data converged or conflicts arose.

**Key Takeaway:** You cannot have both consistency and availability during a partition. The choice depends on your application's requirements.

---

### Scenario 2: Replication Lag Impact

**Objective:** Observe how increasing replication delay affects read-after-write consistency.

**Steps:**

1. Select the "Replication Lag" tab.
2. Start with 0ms lag and write a value through the API.
3. Immediately read the value from a replica and confirm it matches.
4. Drag the slider to 200ms and repeat. Note the warning indicator.
5. Drag the slider to 500ms or above. Note the critical SLA violation warning.
6. Write a value, then immediately read from a replica. Observe stale data.
7. Wait for replication to catch up and confirm the replica eventually converges.

**Key Takeaway:** Even without partitions, replication delay creates windows where reads return stale data. Applications must decide whether to serve potentially stale data or wait for consistency.

---

### Scenario 3: Multi-Model Query Comparison

**Objective:** Compare how relational, document, and graph databases handle the same logical query.

**Steps:**

1. Select the "Multi-Model" tab.
2. Choose "Find orders by customer" and click "Run Query on All".
3. Compare the query syntax, execution time, and result format across PostgreSQL, MongoDB, and Neo4j.
4. Switch to "Product recommendations" and observe how each model expresses aggregation differently.
5. Switch to "Customer social graph" and observe how Neo4j excels at graph traversal while SQL and MongoDB require complex workarounds.

**Key Takeaway:** No single data model is optimal for all access patterns. Polyglot persistence means choosing the right tool for each query type.

---

### Scenario 4: Change Data Capture Pipeline

**Objective:** Understand how CDC propagates changes asynchronously and where consistency can break.

**Steps:**

1. Select the "CDC Pipeline" tab.
2. Observe the Debezium -> Kafka -> Elasticsearch flow with events appearing automatically.
3. Watch events progress through pipeline stages (source -> Debezium -> Kafka -> Elasticsearch).
4. Click "Pause" to stop event flow and observe the pipeline stalls.
5. Click "Replay" to restart the stream from the beginning.
6. Click "Corrupt" to inject a corrupted event and observe how it appears in the pipeline with a red indicator.
7. Discuss what happens if a corrupted event reaches Elasticsearch.

**Key Takeaway:** CDC pipelines provide eventual consistency between systems. Corruption, delays, or failures in any stage can cause the downstream system to diverge from the source of truth. Monitoring and dead-letter queues are essential.

---

## Architecture

```
kv-store-a (8090)  ---network---  kv-store-b (8090)
       |                                |
       +------- lab-api (8080) --------+
                    |
              control-panel (3000)
                    |
               PostgreSQL / MongoDB / Neo4j (for multi-model)
                    |
              Debezium -> Kafka -> Elasticsearch (for CDC)
```

## Cleanup

No special cleanup needed. Stop services with `docker compose down`.
