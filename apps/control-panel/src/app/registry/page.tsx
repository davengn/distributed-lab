"use client";

export default function RegistryPage() {
  return (
    <div>
      <h1 className="text-section text-fg-default mb-6">Service Registry</h1>

      <div className="border border-border rounded-[6px]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-canvas-subtle">
              <th className="px-3 py-2 text-caption font-medium text-fg-muted">Service</th>
              <th className="px-3 py-2 text-caption font-medium text-fg-muted">Status</th>
              <th className="px-3 py-2 text-caption font-medium text-fg-muted">Version</th>
              <th className="px-3 py-2 text-caption font-medium text-fg-muted">Port</th>
              <th className="px-3 py-2 text-caption font-medium text-fg-muted">Dependencies</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border-subtle">
              <td className="px-3 py-2 text-table">Loading services...</td>
              <td className="px-3 py-2" />
              <td className="px-3 py-2" />
              <td className="px-3 py-2" />
              <td className="px-3 py-2" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
