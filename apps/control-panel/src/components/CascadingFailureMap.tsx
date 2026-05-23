"use client";

import { TopologyMap } from "./TopologyMap";
import {
  chaosMapLinks,
  chaosMapNodes,
  type TopologyLink,
  type TopologyNode,
} from "@/lib/prototype-data";

interface CascadingFailureMapProps {
  nodes?: TopologyNode[];
  links?: TopologyLink[];
}

export function CascadingFailureMap({
  nodes = chaosMapNodes,
  links = chaosMapLinks,
}: CascadingFailureMapProps) {
  if (nodes.length === 0) {
    return (
      <p className="text-fg-muted text-sm py-4 text-center">
        No service topology data available
      </p>
    );
  }

  return (
    <TopologyMap
      nodes={nodes}
      links={links}
      viewBox="0 0 600 280"
      ariaLabel="Cascading failure map"
    />
  );
}
