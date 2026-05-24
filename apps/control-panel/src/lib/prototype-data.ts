export type ServiceStatus = 'running' | 'degraded' | 'stopped';
export type ExperimentStatus = 'running' | 'completed' | 'failed' | 'stopped';
export type EventSeverity = 'success' | 'info' | 'warning' | 'error' | 'done';
export type BreakerState = 'closed' | 'open' | 'half_open';
export type TopologyStatus = 'healthy' | 'degraded' | 'failed';

export interface PrototypeService {
  id: string;
  name: string;
  displayName: string;
  description: string;
  status: ServiceStatus;
  version: string;
  image: string;
  dependencies: string[];
  port: number;
  cpuPercent: number;
  memoryPercent: number;
}

export interface PrototypeExperiment {
  id: string;
  description: string;
  module: string;
  status: ExperimentStatus;
  type?: string;
  targetService?: string;
  startedAt?: string;
}

export interface PrototypeEvent {
  timestamp: string;
  severity: EventSeverity;
  message: string;
}

export interface PrototypeFault {
  id: string;
  type: string;
  target: string;
  magnitude: string;
  durationSeconds?: number;
}

export interface PrototypeCircuitBreaker {
  serviceName: string;
  state: BreakerState;
  failureCount: number;
  successRate: number;
  threshold: number;
}

export interface TopologyNode {
  id: string;
  label: string;
  subLabel?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: TopologyStatus;
}

export interface TopologyLink {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  status: TopologyStatus;
}

export interface TopologyLayer {
  label: string;
  x: number;
  y: number;
}

export const prototypeServices: PrototypeService[] = [
  {
    id: 'monolith',
    name: 'monolith',
    displayName: 'monolith',
    description: 'MusicCorp Monolith',
    status: 'running',
    version: 'v1.2.0',
    image: 'spring-boot',
    dependencies: ['catalog', 'order', 'payment'],
    port: 8080,
    cpuPercent: 34,
    memoryPercent: 62,
  },
  {
    id: 'catalog-service',
    name: 'catalog-service',
    displayName: 'catalog',
    description: 'Catalog Service',
    status: 'running',
    version: 'v0.3.1',
    image: 'spring-boot',
    dependencies: ['postgresql', 'mongodb'],
    port: 8081,
    cpuPercent: 12,
    memoryPercent: 28,
  },
  {
    id: 'order-service',
    name: 'order-service',
    displayName: 'order',
    description: 'Order Service',
    status: 'running',
    version: 'v0.2.0',
    image: 'spring-boot',
    dependencies: ['postgresql', 'kafka'],
    port: 8082,
    cpuPercent: 8,
    memoryPercent: 19,
  },
  {
    id: 'payment-service',
    name: 'payment-service',
    displayName: 'payment',
    description: 'Payment Service',
    status: 'degraded',
    version: 'v0.1.5',
    image: 'spring-boot',
    dependencies: ['redis'],
    port: 8083,
    cpuPercent: 45,
    memoryPercent: 71,
  },
  {
    id: 'api-gateway',
    name: 'api-gateway',
    displayName: 'gateway',
    description: 'API Gateway (Envoy)',
    status: 'running',
    version: 'v1.0.0',
    image: 'envoy',
    dependencies: ['monolith'],
    port: 8000,
    cpuPercent: 5,
    memoryPercent: 14,
  },
  {
    id: 'kafka',
    name: 'kafka',
    displayName: 'kafka',
    description: 'Apache Kafka',
    status: 'running',
    version: 'v7.5.0',
    image: 'confluent',
    dependencies: [],
    port: 9092,
    cpuPercent: 22,
    memoryPercent: 48,
  },
];

export const labApiService: PrototypeService = {
  id: 'lab-api',
  name: 'lab-api',
  displayName: 'lab-api',
  description: 'Lab API',
  status: 'running',
  version: 'v0.4.0',
  image: 'spring-boot',
  dependencies: ['docker-socket'],
  port: 3001,
  cpuPercent: 18,
  memoryPercent: 35,
};

export const prototypeExperiments: PrototypeExperiment[] = [
  {
    id: 'EXP-001',
    description: 'Strangler Fig: /api/catalog -> catalog-service',
    module: 'Migration',
    status: 'running',
  },
  {
    id: 'EXP-002',
    description: 'Circuit breaker test: payment-service',
    module: 'Resiliency',
    status: 'running',
  },
  {
    id: 'EXP-003',
    description: 'Replication lag: 250ms artificial delay',
    module: 'Consistency',
    status: 'running',
  },
  {
    id: 'EXP-004',
    description: 'CAP partition: node-2 isolated',
    module: 'Consistency',
    status: 'completed',
  },
];

export const prototypeEvents: PrototypeEvent[] = [
  {
    timestamp: '14:32',
    severity: 'success',
    message: 'Experiment **EXP-001**: Strangler Fig redirect active on `/api/catalog`',
  },
  {
    timestamp: '14:23',
    severity: 'info',
    message:
      'Experiment started: Strangler Fig - redirecting `/api/catalog` -> `catalog-service`',
  },
  {
    timestamp: '14:18',
    severity: 'error',
    message: 'Circuit breaker **OPEN**: payment-service (3 consecutive failures in 60s)',
  },
  {
    timestamp: '14:18',
    severity: 'warning',
    message: 'Fault injected: **+200ms latency** on payment-service',
  },
  {
    timestamp: '14:05',
    severity: 'warning',
    message: 'Fault injected: **5% packet loss** on order-service',
  },
  {
    timestamp: '13:52',
    severity: 'info',
    message: 'Experiment started: Replication lag simulation - 250ms artificial delay',
  },
  {
    timestamp: '13:30',
    severity: 'done',
    message: 'Experiment completed: CAP partition test (**EXP-004**) - results available',
  },
  {
    timestamp: '12:15',
    severity: 'success',
    message: 'Environment started: `docker compose up` - 7 containers running',
  },
];

export const prototypeActiveFaults: PrototypeFault[] = [
  {
    id: 'FLT-001',
    type: 'Latency',
    target: 'payment-service',
    magnitude: '+200ms',
    durationSeconds: 60,
  },
  {
    id: 'FLT-002',
    type: 'Packet loss',
    target: 'order-service',
    magnitude: '5%',
    durationSeconds: 60,
  },
];

export const prototypeCircuitBreakers: PrototypeCircuitBreaker[] = [
  {
    serviceName: 'payment-service',
    state: 'open',
    failureCount: 3,
    successRate: 12,
    threshold: 50,
  },
  {
    serviceName: 'order-service',
    state: 'closed',
    failureCount: 0,
    successRate: 99.2,
    threshold: 50,
  },
  {
    serviceName: 'catalog-service',
    state: 'closed',
    failureCount: 0,
    successRate: 99.8,
    threshold: 50,
  },
];

export const chaosMapLinks: TopologyLink[] = [
  { id: 'monolith-catalog', x1: 300, y1: 55, x2: 120, y2: 130, status: 'healthy' },
  { id: 'monolith-order', x1: 300, y1: 55, x2: 300, y2: 130, status: 'healthy' },
  { id: 'monolith-payment', x1: 300, y1: 55, x2: 480, y2: 130, status: 'degraded' },
  { id: 'catalog-postgres', x1: 120, y1: 175, x2: 180, y2: 240, status: 'healthy' },
  { id: 'order-postgres', x1: 300, y1: 175, x2: 180, y2: 240, status: 'healthy' },
  { id: 'payment-redis', x1: 480, y1: 175, x2: 480, y2: 240, status: 'failed' },
];

export const chaosMapNodes: TopologyNode[] = [
  { id: 'monolith', label: 'monolith', subLabel: ':8080', x: 240, y: 15, width: 120, height: 40, status: 'healthy' },
  {
    id: 'catalog-service',
    label: 'catalog-service',
    subLabel: ':8081',
    x: 55,
    y: 130,
    width: 130,
    height: 40,
    status: 'healthy',
  },
  { id: 'order-service', label: 'order-service', subLabel: ':8082', x: 240, y: 130, width: 120, height: 40, status: 'healthy' },
  {
    id: 'payment-service',
    label: 'payment-service',
    subLabel: ':8083',
    x: 415,
    y: 130,
    width: 130,
    height: 40,
    status: 'degraded',
  },
  { id: 'postgresql', label: 'PostgreSQL', x: 130, y: 240, width: 100, height: 30, status: 'healthy' },
  { id: 'redis', label: 'Redis', x: 445, y: 240, width: 70, height: 30, status: 'healthy' },
];

export const registryLayers: TopologyLayer[] = [
  { label: 'CONTROL', x: 20, y: 35 },
  { label: 'GATEWAY', x: 20, y: 115 },
  { label: 'APPLICATION', x: 20, y: 205 },
  { label: 'SERVICES', x: 20, y: 315 },
  { label: 'DATA', x: 20, y: 410 },
];

export const registryTopologyLinks: TopologyLink[] = [
  { id: 'lab-api-gateway', x1: 400, y1: 55, x2: 400, y2: 95, status: 'healthy' },
  { id: 'gateway-monolith', x1: 400, y1: 135, x2: 400, y2: 185, status: 'healthy' },
  { id: 'monolith-catalog', x1: 400, y1: 225, x2: 200, y2: 295, status: 'healthy' },
  { id: 'monolith-order', x1: 400, y1: 225, x2: 400, y2: 295, status: 'healthy' },
  { id: 'monolith-payment', x1: 400, y1: 225, x2: 600, y2: 295, status: 'degraded' },
  { id: 'catalog-postgres', x1: 200, y1: 335, x2: 160, y2: 390, status: 'healthy' },
  { id: 'catalog-mongo', x1: 200, y1: 335, x2: 320, y2: 390, status: 'healthy' },
  { id: 'order-postgres', x1: 400, y1: 335, x2: 160, y2: 390, status: 'healthy' },
  { id: 'order-kafka', x1: 400, y1: 335, x2: 500, y2: 390, status: 'healthy' },
  { id: 'payment-redis', x1: 600, y1: 335, x2: 680, y2: 390, status: 'healthy' },
];

export const registryTopologyNodes: TopologyNode[] = [
  { id: 'lab-api', label: 'lab-api', subLabel: ':3001', x: 350, y: 17, width: 100, height: 36, status: 'healthy' },
  { id: 'api-gateway', label: 'api-gateway', subLabel: ':8000', x: 345, y: 97, width: 110, height: 36, status: 'healthy' },
  { id: 'monolith', label: 'monolith', subLabel: ':8080', x: 350, y: 187, width: 100, height: 36, status: 'healthy' },
  {
    id: 'catalog-service',
    label: 'catalog-service',
    subLabel: ':8081',
    x: 135,
    y: 297,
    width: 130,
    height: 36,
    status: 'healthy',
  },
  { id: 'order-service', label: 'order-service', subLabel: ':8082', x: 340, y: 297, width: 120, height: 36, status: 'healthy' },
  {
    id: 'payment-service',
    label: 'payment-service',
    subLabel: ':8083',
    x: 535,
    y: 297,
    width: 130,
    height: 36,
    status: 'degraded',
  },
  { id: 'postgresql', label: 'PostgreSQL', x: 110, y: 395, width: 100, height: 30, status: 'healthy' },
  { id: 'mongodb', label: 'MongoDB', x: 280, y: 395, width: 80, height: 30, status: 'healthy' },
  { id: 'kafka', label: 'Kafka', x: 465, y: 395, width: 70, height: 30, status: 'healthy' },
  { id: 'redis', label: 'Redis', x: 645, y: 395, width: 70, height: 30, status: 'healthy' },
];
