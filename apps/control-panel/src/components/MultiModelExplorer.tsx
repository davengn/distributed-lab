"use client";

import { useState, useCallback } from "react";

interface QueryResult {
  query: string;
  latency: number;
  result: string;
  status: "success" | "error";
}

interface DatabaseColumn {
  name: string;
  icon: string;
  color: string;
  queryResult: QueryResult | null;
}

const DEMO_QUERIES: Record<string, { sql: string; mongo: string; cypher: string }> = {
  "Find orders by customer": {
    sql: "SELECT * FROM orders WHERE customer_id = 42",
    mongo: 'db.orders.find({ customer_id: 42 })',
    cypher: "MATCH (c:Customer {id: 42})-[:PLACED]->(o:Order) RETURN o",
  },
  "Product recommendations": {
    sql: "SELECT p.* FROM products p JOIN order_items oi ON p.id = oi.product_id GROUP BY p.id ORDER BY COUNT(*) DESC LIMIT 5",
    mongo: "db.order_items.aggregate([{ $group: { _id: '$product_id', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }])",
    cypher: "MATCH (p:Product)<-[:CONTAINS]-(o:Order) RETURN p, count(o) AS orders ORDER BY orders DESC LIMIT 5",
  },
  "Customer social graph": {
    sql: "-- Requires recursive CTEs or multiple joins\nSELECT c2.* FROM customers c1 JOIN follows f ON c1.id = f.follower_id JOIN customers c2 ON f.followee_id = c2.id WHERE c1.id = 42",
    mongo: "// Requires multiple queries or $lookup\n// Not a natural fit for document stores",
    cypher: "MATCH (c:Customer {id: 42})-[:FOLLOWS*1..3]->(friend:Customer) RETURN DISTINCT friend",
  },
};

export function MultiModelExplorer() {
  const [selectedQuery, setSelectedQuery] = useState<string>("Find orders by customer");
  const [results, setResults] = useState<Record<string, QueryResult | null>>({
    postgresql: null,
    mongodb: null,
    neo4j: null,
  });
  const [running, setRunning] = useState(false);

  const databases: DatabaseColumn[] = [
    {
      name: "PostgreSQL",
      icon: "M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4",
      color: "var(--accent-fg)",
      queryResult: results.postgresql,
    },
    {
      name: "MongoDB",
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
      color: "var(--success-fg)",
      queryResult: results.mongodb,
    },
    {
      name: "Neo4j",
      icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
      color: "var(--attention-fg)",
      queryResult: results.neo4j,
    },
  ];

  const queries = DEMO_QUERIES[selectedQuery];

  const runQueries = useCallback(() => {
    setRunning(true);

    const simResults: Record<string, QueryResult> = {
      postgresql: {
        query: queries.sql,
        latency: Math.round(5 + Math.random() * 20),
        result: selectedQuery === "Customer social graph"
          ? "4 rows returned (complex JOINs)"
          : `${Math.floor(3 + Math.random() * 12)} rows returned`,
        status: "success",
      },
      mongodb: {
        query: queries.mongo,
        latency: Math.round(3 + Math.random() * 15),
        result: selectedQuery === "Customer social graph"
          ? "Requires multiple round-trips"
          : `${Math.floor(3 + Math.random() * 12)} documents returned`,
        status: selectedQuery === "Customer social graph" ? "error" : "success",
      },
      neo4j: {
        query: queries.cypher,
        latency: Math.round(2 + Math.random() * 10),
        result: selectedQuery === "Customer social graph"
          ? "23 nodes returned (graph traversal)"
          : `${Math.floor(3 + Math.random() * 12)} nodes returned`,
        status: selectedQuery === "Customer social graph" ? "success" : "success",
      },
    };

    // Simulate varying latency
    setTimeout(() => {
      setResults(simResults);
      setRunning(false);
    }, 300 + Math.random() * 700);
  }, [selectedQuery, queries]);

  return (
    <div className="border border-border rounded-[6px]">
      <div className="bg-canvas-subtle border-b border-border px-4 py-3">
        <h3 className="text-section text-fg-default">Multi-Model Query Explorer</h3>
      </div>
      <div className="p-4">
        {/* Query selector */}
        <div className="mb-4">
          <label className="block text-caption text-fg-muted mb-1">Select query scenario</label>
          <select
            value={selectedQuery}
            onChange={(e) => {
              setSelectedQuery(e.target.value);
              setResults({ postgresql: null, mongodb: null, neo4j: null });
            }}
            className="w-full border border-border rounded-[6px] px-3 py-1.5 text-sm bg-canvas-default text-fg-default"
          >
            {Object.keys(DEMO_QUERIES).map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>

        <button
          onClick={runQueries}
          disabled={running}
          className="px-4 py-1.5 rounded-[6px] text-sm bg-accent-emphasis text-white hover:opacity-90 transition-opacity disabled:opacity-50 mb-4"
        >
          {running ? "Running..." : "Run Query on All"}
        </button>

        {/* Three-column results */}
        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-3">
          {databases.map((db) => (
            <div key={db.name} className="border border-border rounded-[6px]">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-canvas-subtle">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"
                  stroke={db.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={db.icon} />
                </svg>
                <span className="text-sm font-medium text-fg-default">{db.name}</span>
              </div>
              <div className="p-3 space-y-2">
                <div>
                  <span className="text-caption text-fg-muted">Query</span>
                  <pre className="mt-0.5 text-caption mono text-fg-default bg-canvas-inset rounded-[6px] p-2 overflow-x-auto whitespace-pre-wrap">
                    {db.name === "PostgreSQL" && queries.sql}
                    {db.name === "MongoDB" && queries.mongo}
                    {db.name === "Neo4j" && queries.cypher}
                  </pre>
                </div>
                {db.queryResult ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-caption text-fg-muted">Latency</span>
                      <span className={`mono text-caption ${
                        db.queryResult.latency < 10
                          ? "text-success-fg"
                          : db.queryResult.latency < 20
                            ? "text-attention-fg"
                            : "text-danger-fg"
                      }`}>
                        {db.queryResult.latency}ms
                      </span>
                    </div>
                    <div>
                      <span className="text-caption text-fg-muted">Result</span>
                      <p className={`text-caption ${
                        db.queryResult.status === "success"
                          ? "text-fg-default"
                          : "text-danger-fg"
                      }`}>
                        {db.queryResult.result}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-caption text-fg-muted italic">Click &quot;Run Query&quot; to execute</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
