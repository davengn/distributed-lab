import {
  registryLayers,
  registryTopologyLinks,
  registryTopologyNodes,
  type TopologyLink,
  type TopologyNode,
  type TopologyStatus,
} from '@/lib/prototype-data';
import { TopologyMap } from './TopologyMap';

interface ServiceTopologyProps {
  services?: { name: string; status: string }[];
}

const liveStatusToTopology: Record<string, TopologyStatus> = {
  running: 'healthy',
  degraded: 'degraded',
  stopped: 'failed',
};

function mergeNodes(nodes: TopologyNode[], services: { name: string; status: string }[] | undefined) {
  if (!services || services.length === 0) return nodes;
  return nodes.map((node) => {
    const service = services.find((s) => s.name === node.id);
    if (!service) return node;
    return { ...node, status: liveStatusToTopology[service.status] ?? node.status };
  });
}

function worseStatus(a: TopologyStatus, b: TopologyStatus): TopologyStatus {
  const rank: Record<TopologyStatus, number> = { healthy: 0, degraded: 1, failed: 2 };
  return rank[a] >= rank[b] ? a : b;
}

function deriveLinkStatus(links: TopologyLink[], nodes: TopologyNode[]): TopologyLink[] {
  return links.map((link) => {
    const source = nodes.find(
      (n) => Math.abs(n.x + n.width / 2 - link.x1) < 2 && Math.abs(n.y + n.height / 2 - link.y1) < 2,
    );
    const target = nodes.find(
      (n) => Math.abs(n.x + n.width / 2 - link.x2) < 2 && Math.abs(n.y + n.height / 2 - link.y2) < 2,
    );
    if (!source || !target) return link;
    return { ...link, status: worseStatus(source.status, target.status) };
  });
}

export function ServiceTopology({ services }: ServiceTopologyProps) {
  const mergedNodes = mergeNodes(registryTopologyNodes, services);
  const mergedLinks = deriveLinkStatus(registryTopologyLinks, mergedNodes);

  return (
    <TopologyMap
      nodes={mergedNodes}
      links={mergedLinks}
      layers={registryLayers}
      viewBox="0 0 800 440"
      ariaLabel="Service topology"
    />
  );
}
