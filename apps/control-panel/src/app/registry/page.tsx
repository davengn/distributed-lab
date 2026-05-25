"use client";

import { Panel } from "@/components/Panel";
import { ServiceCatalogTable } from "@/components/ServiceCatalogTable";
import { ServiceTopology } from "@/components/ServiceTopology";
import { useServices } from "@/hooks/useServices";
import { mapServicesToCatalogRows } from "@/lib/registry-display";

export default function RegistryPage() {
  const { services, loading, error } = useServices();
  const rows = mapServicesToCatalogRows(services);

  return (
    <div className="min-w-0">
      <Panel title="Service Topology" className="mb-6" noPadding>
        <ServiceTopology services={services} />
      </Panel>

      <Panel title="Service Catalog" noPadding>
        {(loading || error) && (
          <div className="border-b border-border-subtle px-4 py-2 text-sm text-fg-muted">
            {error ? error : "Connecting to Lab API with review data shown."}
          </div>
        )}
        <ServiceCatalogTable rows={rows} />
      </Panel>
    </div>
  );
}
