import type { ServiceCatalogRow } from '@/lib/registry-display';
import { StatusPill } from './StatusPill';
import { TableShell, tableCellClass, tableHeaderCellClass } from './Panel';

interface ServiceCatalogTableProps {
  rows: ServiceCatalogRow[];
}

export function ServiceCatalogTable({ rows }: ServiceCatalogTableProps) {
  if (rows.length === 0) {
    return <p className="p-4 text-sm text-fg-muted">No services registered</p>;
  }

  return (
    <TableShell minWidth="min-w-[760px]" ariaLabel="Service catalog">
      <thead>
        <tr>
          <th className={tableHeaderCellClass}>Service</th>
          <th className={tableHeaderCellClass}>Status</th>
          <th className={tableHeaderCellClass}>Version</th>
          <th className={tableHeaderCellClass}>Image</th>
          <th className={tableHeaderCellClass}>Dependencies</th>
          <th className={tableHeaderCellClass}>Port</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td className={`${tableCellClass} font-semibold`}>{row.service}</td>
            <td className={`${tableCellClass} whitespace-nowrap`}>
              <StatusPill
                status={row.status}
                label={row.status[0].toUpperCase() + row.status.slice(1)}
              />
            </td>
            <td className={`${tableCellClass} mono whitespace-nowrap`}>{row.version}</td>
            <td className={`${tableCellClass} mono whitespace-nowrap`}>{row.image}</td>
            <td className={`${tableCellClass} text-fg-muted`}>
              {row.dependencies.length > 0 ? row.dependencies.join(', ') : '-'}
            </td>
            <td className={`${tableCellClass} mono whitespace-nowrap`}>{row.port}</td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}
