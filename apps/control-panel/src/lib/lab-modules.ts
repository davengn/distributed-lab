export interface LabModuleFeature {
  name: string;
  description: string;
}

export interface LabModule {
  id: string;
  moduleNumber: number;
  name: string;
  detailName: string;
  description: string;
  tags: string[];
  tone: 'm1' | 'm2' | 'm3' | 'm4' | 'm5';
  features: LabModuleFeature[];
}

export const labModules: LabModule[] = [
  {
    id: 'migration',
    moduleNumber: 1,
    name: 'Migration & Decomposition',
    detailName: 'Migration & Decomposition Lab',
    description:
      'Strangler Fig proxy, Parallel Run comparator, and feature toggle dashboard for safe monolith decomposition.',
    tags: ['Strangler Fig', 'Parallel Run', 'Feature Toggles'],
    tone: 'm1',
    features: [
      {
        name: 'Majestic Monolith template',
        description:
          'A working MusicCorp-style Spring Boot monolith. All data in a single PostgreSQL schema. Clone and incrementally decompose.',
      },
      {
        name: 'Strangler Fig proxy',
        description:
          'Configurable HTTP proxy where learners redirect routes from the monolith to a new microservice via the control panel.',
      },
      {
        name: 'Parallel Run comparator',
        description:
          'Fire the same request at both the monolith and extracted service. Diff the JSON responses side-by-side in the UI.',
      },
      {
        name: 'Feature toggle dashboard',
        description:
          'Runtime controls to flip feature flags between old and new implementations without redeployment. Backed by Redis.',
      },
    ],
  },
  {
    id: 'consistency',
    moduleNumber: 2,
    name: 'Distributed Data & Consistency',
    detailName: 'Distributed Data & Consistency Sandbox',
    description:
      'CAP theorem visualizer, replication lag simulator, multi-model explorer, and CDC pipeline.',
    tags: ['CAP', 'Replication', 'Event Sourcing'],
    tone: 'm2',
    features: [
      {
        name: 'CAP theorem visualizer',
        description:
          'A two-node KV store where the learner manually cuts the network link. Live dashboard shows the Consistency vs Availability choice.',
      },
      {
        name: 'Replication lag simulator',
        description:
          'Async leader-follower PostgreSQL replication with a slider for artificial lag. Read-your-writes violations are surfaced visually.',
      },
      {
        name: 'Data model A/B explorer',
        description:
          'Same social-network domain in PostgreSQL, MongoDB, and Neo4j. Compare latency and schema complexity side-by-side.',
      },
      {
        name: 'CDC & event sourcing pipeline',
        description:
          'Debezium captures changes from PostgreSQL, streams to Kafka, and lets learners pause, replay, and corrupt events.',
      },
    ],
  },
  {
    id: 'resiliency',
    moduleNumber: 3,
    name: 'Resiliency & Chaos',
    detailName: 'Resiliency & Chaos Console',
    description: 'Chaos engineering panel, circuit breaker playground, and cascading failure visualizer.',
    tags: ['Chaos', 'Circuit Breaker', 'Bulkhead'],
    tone: 'm3',
    features: [
      {
        name: 'Chaos engineering panel',
        description:
          'Inject faults into running containers: kill a service, add latency, drop packets, or exhaust memory. Powered by Toxiproxy.',
      },
      {
        name: 'Stability pattern playground',
        description:
          'Pre-wired circuit breaker and bulkhead templates. Configure thresholds and watch breakers open or close in real time.',
      },
      {
        name: 'Cascading failure visualizer',
        description:
          'Live dependency graph highlighting degraded or failed services. Shows whether bulkheads contain the blast radius.',
      },
    ],
  },
  {
    id: 'workflow',
    moduleNumber: 4,
    name: 'Workflow & Communication',
    detailName: 'Workflow & Communication Explorer',
    description:
      'Saga visualizer, idempotency tester, communication style lab, and Pact contract testing.',
    tags: ['Saga', 'Idempotency', 'Messaging'],
    tone: 'm4',
    features: [
      {
        name: 'Saga visualizer',
        description:
          'Same order-fulfillment workflow in orchestrated and choreographed forms. Real-time map shows messages flowing and where coupling occurs.',
      },
      {
        name: 'Idempotency tester',
        description:
          'Replay the same POST multiple times. Verify side effects occur exactly once, then disable the Idempotency-Key and observe double-processing.',
      },
      {
        name: 'Communication style lab',
        description:
          'REST, gRPC, and Kafka side-by-side for the same interaction. Compare latency, throughput, and temporal coupling under load.',
      },
      {
        name: 'Consumer-driven contract tester',
        description:
          'Built-in Pact workflow. Define consumer contracts, run verification, and deliberately break them to see CI fail fast.',
      },
    ],
  },
  {
    id: 'observability',
    moduleNumber: 5,
    name: 'Observability Suite',
    detailName: 'Observability Suite',
    description:
      'Pre-configured metrics, distributed tracing, and a humane service registry. The paved road for all labs.',
    tags: ['Metrics', 'Tracing', 'Registry'],
    tone: 'm5',
    features: [
      {
        name: 'Unified metrics & log aggregator',
        description:
          'Prometheus scrapes all services. Grafana dashboards are pre-built. Loki collects structured logs with zero learner configuration.',
      },
      {
        name: 'Distributed tracing dashboard',
        description:
          'Correlation IDs via OpenTelemetry. Follow a single request across service hops and identify the slowest span.',
      },
      {
        name: 'Humane service registry',
        description:
          'Backstage-inspired catalog with owner, health, API docs, version, and upstream or downstream dependencies for every sandbox service.',
      },
    ],
  },
];
