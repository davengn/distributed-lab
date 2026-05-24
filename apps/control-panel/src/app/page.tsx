"use client";

import { useServices } from "@/hooks/useServices";
import { MetricCard } from "@/components/MetricCard";
import { ServiceCard } from "@/components/ServiceCard";
import { EventFeed } from "@/components/EventFeed";
import { ExperimentsTable } from "@/components/ExperimentsTable";
import { Panel } from "@/components/Panel";
import { apiClient } from "@/lib/api-client";
import {
  prototypeEvents,
  prototypeExperiments,
  prototypeServices,
  type PrototypeExperiment,
  type PrototypeService,
  type ServiceStatus,
} from "@/lib/prototype-data";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { services, loading, error } = useServices();
  const [experiments, setExperiments] = useState<PrototypeExperiment[]>([]);

  useEffect(() => {
    apiClient.get<PrototypeExperiment[]>("/experiments").then(setExperiments).catch(() => {});
  }, []);

  const displayServices =
    services.length > 0 ? services.map(mapLiveServiceToDisplay) : prototypeServices;
  const displayExperiments = experiments.length > 0 ? experiments : prototypeExperiments;
  const realHealthyCount = services.filter((s) => s.status === "running").length;
  const serviceMetric = services.length > 0 ? `${realHealthyCount} / ${services.length}` : "6 / 7";
  const healthPct =
    services.length > 0 ? Math.round((realHealthyCount / services.length) * 100) : 86;

  return (
    <div className="min-w-0">
      <div className="grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 mb-6">
        <MetricCard
          label="Services"
          value={loading && services.length === 0 ? serviceMetric : serviceMetric}
          tone="success"
          sparkline={[18, 16, 14, 15, 12, 10, 11, 9, 8, 9, 7]}
        />
        <MetricCard
          label="Active Experiments"
          value={displayExperiments.length}
          tone="accent"
          sparkline={[22, 20, 18, 15, 14, 12, 10, 8, 7, 6, 5]}
        />
        <MetricCard
          label="System Health"
          value={`${healthPct}%`}
          tone="attention"
          sparkline={[6, 7, 8, 6, 9, 10, 12, 14, 11, 13, 15]}
        />
        <MetricCard
          label="Uptime"
          value="2d 14h"
          subtext={
            <>
              Since last <code>docker compose up</code>
            </>
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 max-xl:grid-cols-1">
        <Panel title="Service Health">
          {error && <p className="text-danger-fg text-sm mb-3">{error}</p>}
          {loading && services.length === 0 && (
            <p className="mb-3 text-sm text-fg-muted">Connecting to Lab API with review data shown.</p>
          )}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2">
            {displayServices.map((s) => (
              <ServiceCard
                key={s.id}
                name={s.name}
                displayName={s.displayName}
                description={s.description}
                status={s.status}
                version={s.version}
                port={s.port}
                cpuPercent={s.cpuPercent}
                memoryPercent={s.memoryPercent}
              />
            ))}
          </div>
        </Panel>

        <Panel title="Active Experiments" noPadding>
          <ExperimentsTable experiments={displayExperiments} />
        </Panel>
      </div>

      <Panel title="Recent Events" noPadding>
        <EventFeed fallbackEvents={prototypeEvents} />
      </Panel>
    </div>
  );
}

function mapLiveServiceToDisplay(service: {
  id: string;
  name: string;
  status: string;
  version: string;
  port: number;
  cpuPercent: number;
  memoryPercent: number;
}): PrototypeService {
  const fallback = prototypeServices.find((item) => item.name === service.name);
  const status: ServiceStatus =
    service.status === "running" || service.status === "degraded" || service.status === "stopped"
      ? service.status
      : "stopped";

  return {
    id: service.id,
    name: service.name,
    displayName: fallback?.displayName ?? service.name,
    description: fallback?.description ?? service.name,
    status,
    version: service.version,
    image: fallback?.image ?? "service",
    dependencies: fallback?.dependencies ?? [],
    port: service.port,
    cpuPercent: service.cpuPercent,
    memoryPercent: service.memoryPercent,
  };
}
