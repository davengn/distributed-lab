"use client";

import { useMemo, useState } from "react";
import { ActiveFaultsTable } from "@/components/ActiveFaultsTable";
import { CascadingFailureMap } from "@/components/CascadingFailureMap";
import { CircuitBreakerCard } from "@/components/CircuitBreakerCard";
import { FaultInjectionForm } from "@/components/FaultInjectionForm";
import { Panel } from "@/components/Panel";
import { showToast, ToastContainer } from "@/components/Toast";
import {
  prototypeActiveFaults,
  prototypeCircuitBreakers,
  type PrototypeFault,
} from "@/lib/prototype-data";

export default function ChaosPage() {
  const [faults, setFaults] = useState<PrototypeFault[]>(prototypeActiveFaults);
  const nextFaultNumber = useMemo(() => {
    return faults.reduce((max, fault) => {
      const numeric = Number(fault.id.replace("FLT-", ""));
      return Number.isNaN(numeric) ? max : Math.max(max, numeric);
    }, 0) + 1;
  }, [faults]);

  function handleInjected(fault: Omit<PrototypeFault, "id">) {
    const id = `FLT-${String(nextFaultNumber).padStart(3, "0")}`;
    setFaults((current) => [...current, { id, ...fault }]);
    showToast(`Fault ${id} injected: ${fault.type} on ${fault.target}`, "success");
  }

  function handleStop(id: string) {
    setFaults((current) => current.filter((fault) => fault.id !== id));
    showToast(`Fault ${id} stopped`, "info");
  }

  return (
    <div className="min-w-0">
      <div className="mb-6 grid grid-cols-2 gap-4 max-xl:grid-cols-1">
        <Panel title="Fault Injection">
          <FaultInjectionForm onInjected={handleInjected} />
        </Panel>

        <Panel
          title="Active Faults"
          meta={<span className="text-caption text-fg-muted">{faults.length} active</span>}
          noPadding
        >
          <ActiveFaultsTable faults={faults} onStop={handleStop} />
        </Panel>
      </div>

      <div className="grid grid-cols-2 gap-4 max-xl:grid-cols-1">
        <Panel title="Circuit Breakers">
          {prototypeCircuitBreakers.map((breaker) => (
            <CircuitBreakerCard key={breaker.serviceName} {...breaker} />
          ))}
        </Panel>

        <Panel title="Cascading Failure Map" noPadding>
          <CascadingFailureMap />
        </Panel>
      </div>

      <ToastContainer />
    </div>
  );
}
