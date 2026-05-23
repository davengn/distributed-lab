"use client";

export default function ChaosPage() {
  return (
    <div>
      <h1 className="text-section text-fg-default mb-6">Chaos Console</h1>

      {/* Fault Injection Form */}
      <div className="border border-border rounded-[6px] mb-6">
        <div className="bg-canvas-subtle border-b border-border px-4 py-3">
          <h2 className="text-section text-fg-default">Inject Fault</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-caption text-fg-muted mb-1">Type</label>
              <select className="w-full border border-border rounded-[6px] px-3 py-1.5 text-sm bg-canvas-default text-fg-default">
                <option value="latency">Latency</option>
                <option value="packet_loss">Packet Loss</option>
                <option value="kill">Kill</option>
                <option value="memory">Memory</option>
                <option value="partition">Partition</option>
              </select>
            </div>
            <div>
              <label className="block text-caption text-fg-muted mb-1">Target</label>
              <select className="w-full border border-border rounded-[6px] px-3 py-1.5 text-sm bg-canvas-default text-fg-default">
                <option value="payment-service">payment-service</option>
                <option value="order-service">order-service</option>
                <option value="catalog-service">catalog-service</option>
              </select>
            </div>
            <div>
              <label className="block text-caption text-fg-muted mb-1">Magnitude</label>
              <input
                type="text"
                placeholder="200ms"
                className="w-full border border-border rounded-[6px] px-3 py-1.5 text-sm bg-canvas-default text-fg-default"
              />
            </div>
            <div>
              <label className="block text-caption text-fg-muted mb-1">Duration (s)</label>
              <input
                type="number"
                defaultValue={60}
                className="w-full border border-border rounded-[6px] px-3 py-1.5 text-sm bg-canvas-default text-fg-default"
              />
            </div>
          </div>
          <button className="px-4 py-1.5 rounded-[6px] text-sm bg-success-emphasis text-white hover:opacity-90 transition-opacity">
            Inject Fault
          </button>
        </div>
      </div>

      {/* Active Faults */}
      <div className="border border-border rounded-[6px] mb-6">
        <div className="bg-canvas-subtle border-b border-border px-4 py-3">
          <h2 className="text-section text-fg-default">Active Faults</h2>
        </div>
        <div className="p-4">
          <p className="text-fg-muted text-sm">No active faults</p>
        </div>
      </div>

      {/* Circuit Breakers */}
      <div className="border border-border rounded-[6px]">
        <div className="bg-canvas-subtle border-b border-border px-4 py-3">
          <h2 className="text-section text-fg-default">Circuit Breakers</h2>
        </div>
        <div className="p-4">
          <p className="text-fg-muted text-sm">No circuit breakers configured</p>
        </div>
      </div>
    </div>
  );
}
