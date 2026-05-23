"use client";

interface ServiceNode {
  name: string;
  health: "healthy" | "degraded" | "failed";
}

interface Connection {
  from: string;
  to: string;
  health: "healthy" | "degraded" | "failed";
}

interface CascadingFailureMapProps {
  services: ServiceNode[];
  connections: Connection[];
}

const HEALTH_BORDER: Record<string, string> = {
  healthy: "stroke-[var(--border-default)]",
  degraded: "stroke-[var(--attention-fg)]",
  failed: "stroke-[var(--danger-fg)]",
};

const HEALTH_FILL: Record<string, string> = {
  healthy: "fill-[var(--canvas-default)]",
  degraded: "fill-[var(--canvas-default)]",
  failed: "fill-[var(--canvas-subtle)]",
};

const HEALTH_TEXT: Record<string, string> = {
  healthy: "fill-[var(--fg-default)]",
  degraded: "fill-[var(--attention-fg)]",
  failed: "fill-[var(--danger-fg)]",
};

const CONNECTION_STYLE: Record<string, string> = {
  healthy: "stroke-[var(--border-default)]",
  degraded: "stroke-[var(--attention-fg)]",
  failed: "stroke-[var(--danger-fg)]",
};

const DASH_STYLE: Record<string, string> = {
  healthy: "",
  degraded: "8 4",
  failed: "8 4",
};

const NODE_WIDTH = 140;
const NODE_HEIGHT = 40;
const PADDING = 40;

export function CascadingFailureMap({
  services,
  connections,
}: CascadingFailureMapProps) {
  if (services.length === 0) {
    return (
      <p className="text-fg-muted text-sm py-4 text-center">
        No service topology data available
      </p>
    );
  }

  const positions = computePositions(services);
  const svgWidth = Math.max(...positions.map((p) => p.x)) + NODE_WIDTH + PADDING;
  const svgHeight = Math.max(...positions.map((p) => p.y)) + NODE_HEIGHT + PADDING;

  const serviceMap = new Map(services.map((s) => [s.name, s]));

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full"
      style={{ maxHeight: "320px" }}
    >
      {/* Connections */}
      {connections.map((conn, i) => {
        const from = positions.find((p) => p.name === conn.from);
        const to = positions.find((p) => p.name === conn.to);
        if (!from || !to) return null;

        const x1 = from.x + NODE_WIDTH / 2;
        const y1 = from.y + NODE_HEIGHT;
        const x2 = to.x + NODE_WIDTH / 2;
        const y2 = to.y;

        return (
          <line
            key={`conn-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            strokeWidth={1}
            className={CONNECTION_STYLE[conn.health]}
            strokeDasharray={DASH_STYLE[conn.health]}
          />
        );
      })}

      {/* Service nodes */}
      {positions.map((pos) => {
        const service = serviceMap.get(pos.name);
        if (!service) return null;
        const health = service.health;

        return (
          <g key={pos.name}>
            <rect
              x={pos.x}
              y={pos.y}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              rx={6}
              ry={6}
              strokeWidth={1}
              className={`${HEALTH_FILL[health]} ${HEALTH_BORDER[health]}`}
            />
            <text
              x={pos.x + NODE_WIDTH / 2}
              y={pos.y + NODE_HEIGHT / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={12}
              fontFamily="var(--font-mono, monospace)"
              className={HEALTH_TEXT[health]}
            >
              {pos.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

interface NodePosition {
  name: string;
  x: number;
  y: number;
}

/**
 * Lays out service nodes in rows. If a node name ends with "-gateway" or
 * "-api" it is placed in the top row (tier 0). Services that appear as
 * connection sources but not targets go in the middle row (tier 1). Remaining
 * services go in the bottom row (tier 2).
 */
function computePositions(services: ServiceNode[]): NodePosition[] {
  const names = services.map((s) => s.name);
  const isGateway = (n: string) => n.endsWith("-gateway") || n.endsWith("-api");

  const tier0 = names.filter(isGateway);
  const tier2 = names.filter((n) => n.endsWith("-db") || n.endsWith("-cache"));
  const tier1 = names.filter(
    (n) => !isGateway(n) && !n.endsWith("-db") && !n.endsWith("-cache")
  );

  const rows = [tier0, tier1, tier2].filter((r) => r.length > 0);
  const positions: NodePosition[] = [];

  rows.forEach((row, rowIdx) => {
    const totalWidth = row.length * NODE_WIDTH + (row.length - 1) * 40;
    const startX = Math.max(PADDING, (600 - totalWidth) / 2);
    const y = PADDING + rowIdx * 100;

    row.forEach((name, colIdx) => {
      positions.push({
        name,
        x: startX + colIdx * (NODE_WIDTH + 40),
        y,
      });
    });
  });

  return positions;
}
