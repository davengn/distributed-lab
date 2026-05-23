import { StatusPill } from "./StatusPill";

interface Experiment {
  id: string;
  type: string;
  status: "pending" | "running" | "completed" | "failed";
  targetService: string;
  startedAt: string;
}

interface ExperimentsTableProps {
  experiments: Experiment[];
}

export function ExperimentsTable({ experiments }: ExperimentsTableProps) {
  if (experiments.length === 0) {
    return <p className="text-fg-muted text-sm">No active experiments</p>;
  }

  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-border-subtle">
          <th className="px-3 py-1.5 text-caption font-medium text-fg-muted">ID</th>
          <th className="px-3 py-1.5 text-caption font-medium text-fg-muted">Type</th>
          <th className="px-3 py-1.5 text-caption font-medium text-fg-muted">Target</th>
          <th className="px-3 py-1.5 text-caption font-medium text-fg-muted">Status</th>
          <th className="px-3 py-1.5 text-caption font-medium text-fg-muted">Started</th>
        </tr>
      </thead>
      <tbody>
        {experiments.map((exp) => (
          <tr key={exp.id} className="border-b border-border-subtle">
            <td className="px-3 py-2 text-table mono">{exp.id}</td>
            <td className="px-3 py-2 text-table">{exp.type.replace(/_/g, " ")}</td>
            <td className="px-3 py-2 text-table">{exp.targetService}</td>
            <td className="px-3 py-2"><StatusPill status={exp.status === "completed" ? "completed" : exp.status === "running" ? "running" : "stopped"} /></td>
            <td className="px-3 py-2 text-table mono">{new Date(exp.startedAt).toLocaleTimeString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
