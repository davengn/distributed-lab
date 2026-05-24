import type { PrototypeFault } from '@/lib/prototype-data';
import { TableShell, tableCellClass, tableHeaderCellClass } from './Panel';

interface ActiveFaultsTableProps {
  faults: PrototypeFault[];
  onStop: (id: string) => void;
}

export function ActiveFaultsTable({ faults, onStop }: ActiveFaultsTableProps) {
  if (faults.length === 0) {
    return <p className="p-4 text-sm text-fg-muted">No active faults</p>;
  }

  return (
    <TableShell minWidth="min-w-[540px]" ariaLabel="Active faults">
      <thead>
        <tr>
          <th className={tableHeaderCellClass}>ID</th>
          <th className={tableHeaderCellClass}>Type</th>
          <th className={tableHeaderCellClass}>Target</th>
          <th className={tableHeaderCellClass}>Magnitude</th>
          <th className={tableHeaderCellClass}>Action</th>
        </tr>
      </thead>
      <tbody>
        {faults.map((fault) => (
          <tr key={fault.id}>
            <td className={`${tableCellClass} mono whitespace-nowrap`}>{fault.id}</td>
            <td className={tableCellClass}>{fault.type}</td>
            <td className={`${tableCellClass} mono whitespace-nowrap`}>{fault.target}</td>
            <td className={`${tableCellClass} mono whitespace-nowrap`}>{fault.magnitude}</td>
            <td className={`${tableCellClass} whitespace-nowrap`}>
              <button type="button" className="btn-danger" onClick={() => onStop(fault.id)}>
                Stop
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}
