"use client";

import { useState } from "react";
import { CapVisualizer } from "@/components/CapVisualizer";
import { ReplicationLagSlider } from "@/components/ReplicationLagSlider";
import { MultiModelExplorer } from "@/components/MultiModelExplorer";
import { CdcPipeline } from "@/components/CdcPipeline";

type Tab = "cap" | "replication" | "multi-model" | "cdc";

const TABS: { key: Tab; label: string }[] = [
  { key: "cap", label: "CAP Theorem" },
  { key: "replication", label: "Replication Lag" },
  { key: "multi-model", label: "Multi-Model" },
  { key: "cdc", label: "CDC Pipeline" },
];

export default function ConsistencyLabPage() {
  const [activeTab, setActiveTab] = useState<Tab>("cap");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-section text-fg-default">Data Consistency Lab</h1>
        <span className="text-caption text-fg-muted">
          Explore trade-offs in distributed data systems
        </span>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-border mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-accent-fg text-accent-fg"
                : "border-transparent text-fg-muted hover:text-fg-default"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "cap" && (
        <div className="space-y-6">
          <CapVisualizer />
          <div className="border border-border rounded-[6px] p-4">
            <h4 className="text-section text-fg-default mb-2">About CAP Theorem</h4>
            <p className="text-body text-fg-muted">
              The CAP theorem states that a distributed system can provide at most two of three
              guarantees: Consistency (every read receives the most recent write), Availability
              (every request receives a response), and Partition tolerance (the system continues
              to operate despite network failures). Since network partitions are unavoidable in
              distributed systems, the real choice is between consistency and availability when
              a partition occurs.
            </p>
          </div>
        </div>
      )}

      {activeTab === "replication" && (
        <div className="space-y-6">
          <ReplicationLagSlider />
          <div className="border border-border rounded-[6px] p-4">
            <h4 className="text-section text-fg-default mb-2">About Replication Lag</h4>
            <p className="text-body text-fg-muted">
              Replication lag is the delay between when data is written to the primary database
              and when it becomes visible on replica nodes. High lag can cause read-after-write
              inconsistencies where users submit data but cannot immediately see their changes.
              This lab simulates adjustable lag to observe its impact on application behavior.
            </p>
          </div>
        </div>
      )}

      {activeTab === "multi-model" && (
        <div className="space-y-6">
          <MultiModelExplorer />
          <div className="border border-border rounded-[6px] p-4">
            <h4 className="text-section text-fg-default mb-2">About Multi-Model Queries</h4>
            <p className="text-body text-fg-muted">
              Different database models excel at different query patterns. Relational databases
              (PostgreSQL) handle structured queries and joins. Document stores (MongoDB) are
              optimized for flexible schemas and aggregation pipelines. Graph databases (Neo4j)
              excel at traversing relationships. This explorer runs the same logical query across
              all three to compare expressiveness and performance.
            </p>
          </div>
        </div>
      )}

      {activeTab === "cdc" && (
        <div className="space-y-6">
          <CdcPipeline />
          <div className="border border-border rounded-[6px] p-4">
            <h4 className="text-section text-fg-default mb-2">
              About Change Data Capture
            </h4>
            <p className="text-body text-fg-muted">
              Change Data Capture (CDC) streams database row-level changes to downstream systems
              in real time. Debezium reads the PostgreSQL write-ahead log, publishes events to
              Kafka, and Elasticsearch indexes them for search. This pipeline demonstrates
              eventual consistency in action: changes propagate asynchronously, and corruption
              or delays can cause the search index to diverge from the source of truth.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
