import {
  registryLayers,
  registryTopologyLinks,
  registryTopologyNodes,
} from '@/lib/prototype-data';
import { TopologyMap } from './TopologyMap';

export function ServiceTopology() {
  return (
    <TopologyMap
      nodes={registryTopologyNodes}
      links={registryTopologyLinks}
      layers={registryLayers}
      viewBox="0 0 800 440"
      ariaLabel="Service topology"
    />
  );
}
