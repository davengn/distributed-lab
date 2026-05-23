import type {
  TopologyLayer,
  TopologyLink,
  TopologyNode,
  TopologyStatus,
} from '@/lib/prototype-data';

interface TopologyMapProps {
  nodes: TopologyNode[];
  links: TopologyLink[];
  layers?: TopologyLayer[];
  viewBox: string;
  ariaLabel: string;
}

const statusStroke: Record<TopologyStatus, string> = {
  healthy: 'var(--border-default)',
  degraded: 'var(--attention-fg)',
  failed: 'var(--danger-fg)',
};

const statusDot: Record<TopologyStatus, string> = {
  healthy: 'var(--success-fg)',
  degraded: 'var(--attention-fg)',
  failed: 'var(--danger-fg)',
};

export function TopologyMap({ nodes, links, layers = [], viewBox, ariaLabel }: TopologyMapProps) {
  return (
    <div className="overflow-x-auto px-4 py-6">
      <svg
        viewBox={viewBox}
        role="img"
        aria-label={ariaLabel}
        className="mx-auto block w-full min-w-[560px] max-w-[800px]"
      >
        {layers.map((layer) => (
          <text
            key={layer.label}
            x={layer.x}
            y={layer.y}
            fill="var(--fg-muted)"
            fontSize="10"
            fontFamily="var(--font-mono)"
          >
            {layer.label}
          </text>
        ))}

        {links.map((link) => (
          <line
            key={link.id}
            x1={link.x1}
            y1={link.y1}
            x2={link.x2}
            y2={link.y2}
            stroke={statusStroke[link.status]}
            strokeWidth="1.5"
            strokeDasharray={link.status === 'healthy' ? undefined : '4 3'}
            fill="none"
          />
        ))}

        {nodes.map((node) => (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width={node.width}
              height={node.height}
              rx="6"
              fill="var(--canvas-default)"
              stroke={node.status === 'healthy' ? 'var(--border-default)' : statusStroke[node.status]}
              strokeWidth="1"
            />
            <text
              x={node.x + node.width / 2}
              y={node.y + node.height / 2 - (node.subLabel ? 5 : 0)}
              fill="var(--fg-default)"
              fontSize="11"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {node.label}
            </text>
            {node.subLabel && (
              <text
                x={node.x + node.width / 2}
                y={node.y + node.height / 2 + 9}
                fill="var(--fg-muted)"
                fontSize="9"
                fontFamily="var(--font-mono)"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {node.subLabel}
              </text>
            )}
            <circle
              cx={node.x + node.width - 12}
              cy={node.y + 10}
              r="4"
              fill={statusDot[node.status]}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
