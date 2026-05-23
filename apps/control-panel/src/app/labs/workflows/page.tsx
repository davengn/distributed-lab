"use client";

import { SagaVisualizer } from "@/components/SagaVisualizer";
import { IdempotencyTester } from "@/components/IdempotencyTester";
import { CommunicationComparison } from "@/components/CommunicationComparison";

export default function WorkflowsLabPage() {
  return (
    <div>
      <h1 className="text-section text-fg-default mb-6">
        Workflow &amp; Communication Lab
      </h1>

      <div className="space-y-6">
        <SagaVisualizer />
        <IdempotencyTester />
        <CommunicationComparison />
      </div>
    </div>
  );
}
