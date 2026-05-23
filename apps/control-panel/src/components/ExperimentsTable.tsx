import { StatusPill } from "./StatusPill";
import { TableShell, tableCellClass, tableHeaderCellClass } from "./Panel";

interface Experiment {
  id: string;
  description?: string;
  module?: string;
  type?: string;
  status: "pending" | "running" | "completed" | "failed" | "stopped";
  targetService?: string;
  startedAt?: string;
}

interface ExperimentsTableProps {
  experiments: Experiment[];
}

export function ExperimentsTable({ experiments }: ExperimentsTableProps) {
  if (experiments.length === 0) {
    return <p className="p-4 text-sm text-fg-muted">No active experiments</p>;
  }

  return (
    <TableShell minWidth="min-w-[520px]" ariaLabel="Active experiments">
      <thead>
        <tr>
          <th className={tableHeaderCellClass}>ID</th>
          <th className={tableHeaderCellClass}>Experiment</th>
          <th className={tableHeaderCellClass}>Module</th>
          <th className={tableHeaderCellClass}>Status</th>
        </tr>
      </thead>
      <tbody>
        {experiments.map((exp) => {
          const normalized = normalizeExperiment(exp);

          return (
            <tr key={normalized.id}>
              <td className={`${tableCellClass} mono whitespace-nowrap`}>{normalized.id}</td>
              <td className={`${tableCellClass} max-w-[260px] truncate`}>
                {normalized.description}
              </td>
              <td className={`${tableCellClass} whitespace-nowrap`}>{normalized.module}</td>
              <td className={`${tableCellClass} whitespace-nowrap`}>
                <StatusPill status={normalized.status} label={normalized.label} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </TableShell>
  );
}

function normalizeExperiment(exp: Experiment) {
  const status = mapStatus(exp.status);
  const fallbackDescription = [exp.type?.replace(/_/g, " "), exp.targetService]
    .filter(Boolean)
    .join(": ");

  return {
    id: exp.id,
    description: exp.description ?? fallbackDescription,
    module: exp.module ?? exp.targetService ?? "Sandbox",
    status,
    label: status === "completed" ? "Done" : status[0].toUpperCase() + status.slice(1),
  };
}

function mapStatus(status: Experiment["status"]): "running" | "completed" | "failed" | "stopped" {
  if (status === "running") return "running";
  if (status === "completed") return "completed";
  if (status === "failed") return "failed";
  return "stopped";
}
