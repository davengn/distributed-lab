"use client";

import { useServices } from "@/hooks/useServices";
import { MetricCard } from "@/components/MetricCard";
import { ServiceCard } from "@/components/ServiceCard";
import { EventFeed } from "@/components/EventFeed";
import { ExperimentsTable } from "@/components/ExperimentsTable";
import { apiClient } from "@/lib/api-client";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { services, loading, error } = useServices();
  const [experiments, setExperiments] = useState([]);

  useEffect(() => {
    apiClient.get<never[]>("/experiments").then(setExperiments).catch(() => {});
  }, []);

  const healthyCount = services.filter((s) => s.status === "running").length;
  const healthPct = services.length > 0 ? Math.round((healthyCount / services.length) * 100) : 0;

  return (
    <div>
      <h1 className="text-section text-fg-default mb-6">Dashboard</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 mb-6">
        <MetricCard label="Services" value={loading ? "--" : String(services.length)} />
        <MetricCard label="Active Experiments" value={String(experiments.length)} />
        <MetricCard label="System Health" value={loading ? "--" : `${healthPct}%`} />
        <MetricCard label="Uptime" value="--" />
      </div>

      {/* Service Health Grid */}
      <div className="border border-border rounded-[6px] mb-6">
        <div className="bg-canvas-subtle border-b border-border px-4 py-3">
          <h2 className="text-section text-fg-default">Service Health</h2>
        </div>
        <div className="p-4">
          {error && <p className="text-danger-fg text-sm mb-3">{error}</p>}
          {loading ? (
            <p className="text-fg-muted text-sm">Connecting to Lab API...</p>
          ) : services.length === 0 ? (
            <p className="text-fg-muted text-sm">No services detected</p>
          ) : (
            <div className="grid grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1 gap-3">
              {services.map((s) => (
                <ServiceCard
                  key={s.id}
                  name={s.name}
                  status={s.status as "running" | "degraded" | "stopped"}
                  version={s.version}
                  port={s.port}
                  cpuPercent={s.cpuPercent}
                  memoryPercent={s.memoryPercent}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Experiments + Events */}
      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
        <div className="border border-border rounded-[6px]">
          <div className="bg-canvas-subtle border-b border-border px-4 py-3">
            <h2 className="text-section text-fg-default">Active Experiments</h2>
          </div>
          <div className="p-4">
            <ExperimentsTable experiments={experiments} />
          </div>
        </div>
        <div className="border border-border rounded-[6px]">
          <div className="bg-canvas-subtle border-b border-border px-4 py-3">
            <h2 className="text-section text-fg-default">Recent Events</h2>
          </div>
          <div className="p-4">
            <EventFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
