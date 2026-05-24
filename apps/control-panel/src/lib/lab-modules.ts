export interface LabModuleFeature {
  name: string;
  description: string;
}

export interface LabRuntimeActivityState {
  status: 'pending' | 'running' | 'completed' | 'failed' | 'stopped' | 'inactive';
  summary: string;
  lastUpdated?: string;
}

export interface LabExperimentDefinition {
  id: string;
  title: string;
  concepts: string[];
  objective: string;
  setup: string;
  action: string;
  expectedObservation: string;
  successSignal: string;
  duration?: string;
  difficulty?: 'Introductory' | 'Intermediate' | 'Advanced';
  runtimeStatus?: LabRuntimeActivityState;
}

export interface LabGuideStep {
  title: string;
  instruction: string;
  observation: string;
}

export interface LabGuideSection {
  objective: string;
  prerequisites: string[];
  setupCheck: string;
  steps: LabGuideStep[];
  observationChecklist: string[];
  validation: string[];
  cleanup: string;
  nextSteps?: string[];
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
  experiments: LabExperimentDefinition[];
  guide: LabGuideSection;
}

const inactiveRuntime: LabRuntimeActivityState = {
  status: 'inactive',
  summary: 'No live run is active. Use the catalog below to choose the next lab activity.',
};

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
    experiments: [
      {
        id: 'migration-strangler-route',
        title: 'Strangler route switch',
        concepts: ['Strangler Fig proxy', 'Majestic Monolith template'],
        objective: 'Move one capability away from the monolith while the original route remains available.',
        setup: 'Confirm the monolith and extracted service are healthy, then pick one route to redirect.',
        action: 'Shift the selected route through the proxy and send the same learner request again.',
        expectedObservation:
          'Traffic for the selected capability reaches the extracted service while untouched routes still reach the monolith.',
        successSignal:
          'The redirected route returns the expected response and the monolith remains available for all other behavior.',
        duration: '8 minutes',
        difficulty: 'Introductory',
        runtimeStatus: inactiveRuntime,
      },
      {
        id: 'migration-parallel-compare',
        title: 'Parallel response comparison',
        concepts: ['Parallel Run comparator'],
        objective: 'Prove the new service matches monolith behavior before shifting user traffic.',
        setup: 'Choose a representative request that both the monolith and extracted service can handle.',
        action: 'Run the request through the comparator and review the side-by-side response diff.',
        expectedObservation:
          'Matching fields appear aligned and any behavioral mismatch is isolated to a specific response value.',
        successSignal: 'The comparator shows no unexpected drift for the chosen request.',
        duration: '6 minutes',
        difficulty: 'Introductory',
        runtimeStatus: inactiveRuntime,
      },
      {
        id: 'migration-toggle-cutover',
        title: 'Feature toggle cutover',
        concepts: ['Feature toggle dashboard'],
        objective: 'Use a runtime toggle to move traffic safely without redeploying services.',
        setup: 'Locate the old and new implementation toggle for the selected capability.',
        action: 'Flip the toggle to the new implementation and repeat the learner request.',
        expectedObservation:
          'The response comes from the new path while the dashboard still allows an immediate return to the old path.',
        successSignal: 'The learner can switch forward and back without service restart or broken responses.',
        duration: '5 minutes',
        difficulty: 'Introductory',
        runtimeStatus: inactiveRuntime,
      },
      {
        id: 'migration-rollback',
        title: 'Rollback rehearsal',
        concepts: ['Strangler Fig proxy', 'Feature toggle dashboard'],
        objective: 'Practice reversing a migration decision before it becomes an incident.',
        setup: 'Start from a route that has already been shifted to the extracted service.',
        action: 'Restore the route or toggle to the monolith path and repeat the same request.',
        expectedObservation:
          'The old implementation receives traffic again and the learner can compare behavior with the shifted path.',
        successSignal: 'Rollback completes without changing unrelated routes or losing request visibility.',
        duration: '5 minutes',
        difficulty: 'Intermediate',
        runtimeStatus: inactiveRuntime,
      },
    ],
    guide: {
      objective:
        'Decompose one capability safely by routing, comparing, toggling, and rehearsing rollback before full cutover.',
      prerequisites: [
        'Local DistributedLab environment is running.',
        'Monolith, proxy, and extracted service health indicators are visible.',
        'You have a known request that represents the capability being migrated.',
      ],
      setupCheck:
        'Open the Labs view, select Migration & Decomposition, and confirm the monolith feature list and service health are visible.',
      steps: [
        {
          title: 'Start from the monolith',
          instruction: 'Send the representative request through the existing monolith route.',
          observation: 'The baseline response establishes the behavior the extracted service must preserve.',
        },
        {
          title: 'Route one capability',
          instruction: 'Use the Strangler Fig route switch to direct only the selected capability to the extracted service.',
          observation: 'Only the chosen route moves; unrelated monolith routes continue to respond normally.',
        },
        {
          title: 'Compare behavior',
          instruction: 'Run the same request through the Parallel Run comparator.',
          observation: 'The side-by-side response makes any semantic drift visible before user traffic fully shifts.',
        },
        {
          title: 'Flip traffic safely',
          instruction: 'Use the feature toggle to switch between old and new implementations.',
          observation: 'Responses continue without redeploying, and the old path remains available.',
        },
        {
          title: 'Validate rollback',
          instruction: 'Return the toggle or route to the monolith path and repeat the request.',
          observation: 'The system returns to the baseline behavior without affecting other capabilities.',
        },
      ],
      observationChecklist: [
        'Route ownership changes only for the selected capability.',
        'Comparator output shows expected response parity.',
        'Feature toggle state is visible and reversible.',
      ],
      validation: [
        'Baseline, shifted, and rollback requests all return successful responses.',
        'No unrelated route changes behavior during the exercise.',
      ],
      cleanup:
        'Restore the route and feature toggle to the starting state before moving to another module.',
      nextSteps: ['Try the same migration sequence with a request that includes edge-case data.'],
    },
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
    experiments: [
      {
        id: 'consistency-cap-partition',
        title: 'CAP partition drill',
        concepts: ['CAP theorem visualizer'],
        objective: 'See why a partition forces a choice between consistency and availability.',
        setup: 'Write a baseline key, then prepare to cut the link between the two KV nodes.',
        action: 'Create the partition and choose whether reads should remain available or strictly consistent.',
        expectedObservation:
          'One side of the system either rejects work for consistency or accepts divergent reads for availability.',
        successSignal: 'The dashboard clearly shows the chosen CAP trade-off during the partition.',
        duration: '8 minutes',
        difficulty: 'Introductory',
        runtimeStatus: inactiveRuntime,
      },
      {
        id: 'consistency-replication-lag',
        title: 'Replication lag window',
        concepts: ['Replication lag simulator'],
        objective: 'Observe read-your-writes violations caused by asynchronous replication.',
        setup: 'Set a measurable lag value and prepare one write followed by an immediate replica read.',
        action: 'Write to the leader, read from the follower, then reduce lag and repeat.',
        expectedObservation:
          'Replica reads can temporarily return stale values until replication catches up.',
        successSignal: 'The stale-read window shrinks when lag is reduced or reads target the leader.',
        duration: '7 minutes',
        difficulty: 'Introductory',
        runtimeStatus: inactiveRuntime,
      },
      {
        id: 'consistency-multi-model',
        title: 'Multi-model query comparison',
        concepts: ['Data model A/B explorer'],
        objective: 'Compare how relational, document, and graph models answer the same domain question.',
        setup: 'Choose the same social-network query across PostgreSQL, MongoDB, and Neo4j.',
        action: 'Run the query in each model and compare shape, latency, and schema complexity.',
        expectedObservation:
          'Each model expresses the same question differently and favors different access patterns.',
        successSignal: 'The learner can name which model best fits the selected query and why.',
        duration: '10 minutes',
        difficulty: 'Intermediate',
        runtimeStatus: inactiveRuntime,
      },
      {
        id: 'consistency-cdc-replay',
        title: 'CDC replay checkpoint',
        concepts: ['CDC & event sourcing pipeline'],
        objective: 'Understand how paused or replayed change events affect downstream projections.',
        setup: 'Prepare one source database change and locate the downstream projection view.',
        action: 'Pause the CDC pipeline, apply the change, inspect divergence, then replay the event.',
        expectedObservation:
          'The projection lags or diverges while CDC is paused and converges after replay.',
        successSignal: 'The source of truth and projection match again after the replay checkpoint.',
        duration: '10 minutes',
        difficulty: 'Advanced',
        runtimeStatus: inactiveRuntime,
      },
    ],
    guide: {
      objective:
        'Create controlled inconsistency, observe divergence, and recover so consistency trade-offs become visible.',
      prerequisites: [
        'Local DistributedLab environment is running.',
        'KV store, database, and pipeline health indicators are visible.',
        'You have a sample key or record that can be safely changed.',
      ],
      setupCheck:
        'Open the Distributed Data & Consistency module and confirm CAP, replication, multi-model, and CDC controls are visible.',
      steps: [
        {
          title: 'Prepare sample data',
          instruction: 'Write a baseline key or record that can be read from multiple views.',
          observation: 'The initial value appears consistently before any partition or lag is introduced.',
        },
        {
          title: 'Create a consistency stress case',
          instruction: 'Cut the KV link or add replication lag, then perform a write and immediate read.',
          observation: 'The UI surfaces a stale read, rejected write, or explicit consistency trade-off.',
        },
        {
          title: 'Observe divergence',
          instruction: 'Compare the source value with replica, projection, or alternate model output.',
          observation: 'The mismatch shows where eventual consistency is visible to users.',
        },
        {
          title: 'Recover the pipeline',
          instruction: 'Restore the link, reduce lag, or replay CDC events.',
          observation: 'Divergent values converge after the system catches up.',
        },
        {
          title: 'Validate recovery',
          instruction: 'Repeat the read path that previously showed stale or divergent data.',
          observation: 'The read path now returns the expected current value.',
        },
      ],
      observationChecklist: [
        'Partition or lag state is clearly visible.',
        'Divergence is tied to a specific read path.',
        'Recovery makes the values converge again.',
      ],
      validation: [
        'The learner can explain the consistency or availability trade-off they chose.',
        'The final read returns the expected recovered value.',
      ],
      cleanup:
        'Restore network links, reset lag to the default, resume CDC, and clear temporary sample data if needed.',
      nextSteps: ['Repeat the drill with a higher lag value to compare the user impact window.'],
    },
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
    experiments: [
      {
        id: 'resiliency-latency-fault',
        title: 'Bounded latency fault',
        concepts: ['Chaos engineering panel'],
        objective: 'Inject latency into one service and watch how the system absorbs the slowdown.',
        setup: 'Select a non-critical target service and choose a short duration with moderate latency.',
        action: 'Inject the latency fault and continue sending normal traffic through the control panel.',
        expectedObservation:
          'The target service degrades while unrelated services should remain usable.',
        successSignal: 'The fault stops within the configured window and the service returns to healthy.',
        duration: '6 minutes',
        difficulty: 'Introductory',
        runtimeStatus: inactiveRuntime,
      },
      {
        id: 'resiliency-breaker-threshold',
        title: 'Circuit breaker threshold',
        concepts: ['Stability pattern playground', 'Circuit Breaker'],
        objective: 'See how repeated failures open a circuit breaker to protect callers.',
        setup: 'Choose a service pair with circuit breaker metrics visible.',
        action: 'Trigger repeated failures until the breaker opens, then stop the fault and observe recovery.',
        expectedObservation:
          'Calls fail fast while the breaker is open and resume after the recovery window.',
        successSignal: 'The breaker moves from closed to open and back to closed after healthy calls return.',
        duration: '8 minutes',
        difficulty: 'Intermediate',
        runtimeStatus: inactiveRuntime,
      },
      {
        id: 'resiliency-containment',
        title: 'Cascading failure containment',
        concepts: ['Cascading failure visualizer', 'Bulkhead'],
        objective: 'Confirm bulkheads limit how far one degraded dependency can spread.',
        setup: 'Open the failure map and identify upstream and downstream dependencies for the target service.',
        action: 'Apply a bounded fault to the target and inspect the dependency graph.',
        expectedObservation:
          'The graph highlights degraded links while bulkheaded neighbors stay healthy.',
        successSignal: 'The affected region is contained and the map returns to healthy after the fault ends.',
        duration: '8 minutes',
        difficulty: 'Intermediate',
        runtimeStatus: inactiveRuntime,
      },
    ],
    guide: {
      objective:
        'Inject a bounded fault, observe protective patterns, and restore the system without leaving hidden failure state behind.',
      prerequisites: [
        'Local DistributedLab environment is running.',
        'At least one target service shows healthy before the experiment.',
        'Chaos, circuit breaker, and failure-map panels are visible.',
      ],
      setupCheck:
        'Open the Resiliency & Chaos module and confirm service health, breaker state, and failure-map panels are readable.',
      steps: [
        {
          title: 'Pick a target service',
          instruction: 'Choose a service that has visible upstream or downstream dependencies.',
          observation: 'The failure map gives you a baseline for the expected blast radius.',
        },
        {
          title: 'Inject a bounded fault',
          instruction: 'Apply a latency, packet-loss, or service-stop fault with a short duration.',
          observation: 'The target service changes status while the configured timer limits the experiment.',
        },
        {
          title: 'Watch breaker behavior',
          instruction: 'Continue traffic and inspect circuit breaker state for the affected dependency.',
          observation: 'The breaker opens or failure rate rises as repeated calls fail.',
        },
        {
          title: 'Check containment',
          instruction: 'Inspect the cascading failure visualizer for degraded links and healthy boundaries.',
          observation: 'Bulkheaded or unrelated services should remain outside the degraded region.',
        },
        {
          title: 'Stop and recover',
          instruction: 'Stop the fault or wait for its duration to expire, then continue healthy traffic.',
          observation: 'The service, breaker, and dependency links return to normal state.',
        },
      ],
      observationChecklist: [
        'Fault duration and target are visible.',
        'Breaker state changes match the fault behavior.',
        'Failure-map links show containment boundaries.',
      ],
      validation: [
        'The target service returns to healthy after the fault stops.',
        'Unrelated services are not left degraded.',
      ],
      cleanup: 'Stop any active faults and confirm the failure map has no degraded or failed links.',
      nextSteps: ['Repeat with a smaller magnitude to compare graceful degradation against visible failure.'],
    },
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
    experiments: [
      {
        id: 'workflow-saga-failure',
        title: 'Saga failure path',
        concepts: ['Saga visualizer'],
        objective: 'Compare how orchestrated and choreographed sagas recover from a failed step.',
        setup: 'Choose the order workflow and enable a failure at the payment or confirmation step.',
        action: 'Run both saga styles and inspect the message or command flow.',
        expectedObservation:
          'The visualizer shows compensation steps and reveals where coordination responsibility lives.',
        successSignal: 'The final workflow state is either completed or compensated with no partial order left open.',
        duration: '10 minutes',
        difficulty: 'Intermediate',
        runtimeStatus: inactiveRuntime,
      },
      {
        id: 'workflow-idempotency-replay',
        title: 'Idempotency replay',
        concepts: ['Idempotency tester'],
        objective: 'Verify repeated commands do not create duplicate side effects.',
        setup: 'Prepare one POST request with an Idempotency-Key and a known order or payment identifier.',
        action: 'Replay the request multiple times, then repeat after disabling the key.',
        expectedObservation:
          'With idempotency enabled, the side effect occurs once; without it, duplicate processing becomes visible.',
        successSignal: 'The learner can identify the idempotency key as the boundary protecting side effects.',
        duration: '8 minutes',
        difficulty: 'Introductory',
        runtimeStatus: inactiveRuntime,
      },
      {
        id: 'workflow-communication-style',
        title: 'Communication style comparison',
        concepts: ['Communication style lab', 'Messaging'],
        objective: 'Compare synchronous and asynchronous communication under the same interaction.',
        setup: 'Select the same business operation for REST, gRPC, and Kafka paths.',
        action: 'Run the operation through each style and compare latency, throughput, and coupling cues.',
        expectedObservation:
          'Synchronous paths expose immediate latency while messaging shows temporal decoupling.',
        successSignal: 'The learner can choose a communication style based on coupling and feedback needs.',
        duration: '9 minutes',
        difficulty: 'Intermediate',
        runtimeStatus: inactiveRuntime,
      },
      {
        id: 'workflow-contract-breakage',
        title: 'Contract breakage drill',
        concepts: ['Consumer-driven contract tester'],
        objective: 'See how consumer contracts catch provider changes before integration breaks users.',
        setup: 'Open the Pact contract scenario and identify one expected provider field.',
        action: 'Run verification, introduce a breaking provider change, then run verification again.',
        expectedObservation:
          'The second verification fails at the contract boundary before the learner relies on the changed API.',
        successSignal: 'The failed contract names the broken expectation and the affected consumer.',
        duration: '10 minutes',
        difficulty: 'Advanced',
        runtimeStatus: inactiveRuntime,
      },
    ],
    guide: {
      objective:
        'Run a distributed workflow, inspect communication style trade-offs, and validate safeguards against duplicate work and broken contracts.',
      prerequisites: [
        'Local DistributedLab environment is running.',
        'Order, payment, messaging, and contract panels are visible.',
        'You have one safe sample order identifier for repeated workflow runs.',
      ],
      setupCheck:
        'Open the Workflow & Communication module and confirm saga, idempotency, communication, and contract controls are visible.',
      steps: [
        {
          title: 'Run a workflow',
          instruction: 'Start the order-fulfillment workflow with the sample order identifier.',
          observation: 'The saga view shows each service step and the current workflow state.',
        },
        {
          title: 'Inspect message flow',
          instruction: 'Compare orchestrated commands with choreographed events for the same business action.',
          observation: 'Coordination shifts between the central orchestrator and service-to-service events.',
        },
        {
          title: 'Replay safely',
          instruction: 'Submit the same request repeatedly with an Idempotency-Key.',
          observation: 'The system returns stable results without duplicate side effects.',
        },
        {
          title: 'Compare coupling',
          instruction: 'Run the same interaction through REST, gRPC, and Kafka paths.',
          observation: 'Latency, feedback timing, and failure behavior differ by communication style.',
        },
        {
          title: 'Validate contract protection',
          instruction: 'Run contract verification before and after a deliberate provider mismatch.',
          observation: 'The contract test fails before the changed provider behavior reaches a consumer.',
        },
      ],
      observationChecklist: [
        'Saga steps are visible and end in completed or compensated state.',
        'Repeated requests do not duplicate protected side effects.',
        'Contract failure names the changed expectation.',
      ],
      validation: [
        'The learner can explain when to use orchestration, choreography, synchronous calls, or messaging.',
        'The final sample order is not left in an ambiguous partial state.',
      ],
      cleanup:
        'Reset the sample workflow, restore the provider contract, and clear temporary replay attempts.',
      nextSteps: ['Try the same workflow with a delayed downstream service to compare failure handling.'],
    },
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
    experiments: [
      {
        id: 'observability-trace-request',
        title: 'Trace one request',
        concepts: ['Distributed tracing dashboard'],
        objective: 'Follow one request across service hops and identify where time is spent.',
        setup: 'Generate a request with a visible correlation ID.',
        action: 'Open the trace view and follow the request from gateway to downstream services.',
        expectedObservation:
          'Each span shows service ownership, timing, and parent-child relationships.',
        successSignal: 'The learner can identify the slowest span and the service responsible for it.',
        duration: '6 minutes',
        difficulty: 'Introductory',
        runtimeStatus: inactiveRuntime,
      },
      {
        id: 'observability-metric-log-triage',
        title: 'Metric and log triage',
        concepts: ['Unified metrics & log aggregator', 'Metrics'],
        objective: 'Correlate a visible symptom with metrics and structured logs.',
        setup: 'Create normal activity, then introduce a warning or degraded condition.',
        action: 'Inspect metrics for the symptom and use logs to confirm the affected service.',
        expectedObservation:
          'Metrics show the trend and logs provide the request or service context behind it.',
        successSignal: 'The learner can explain the incident using both a metric and a log entry.',
        duration: '8 minutes',
        difficulty: 'Intermediate',
        runtimeStatus: inactiveRuntime,
      },
      {
        id: 'observability-registry-dependency',
        title: 'Registry dependency inspection',
        concepts: ['Humane service registry', 'Registry'],
        objective: 'Use the service registry to understand ownership, health, and dependency direction.',
        setup: 'Pick a service that appears in the topology and catalog.',
        action: 'Open its registry entry and compare upstream and downstream dependencies.',
        expectedObservation:
          'The catalog connects service ownership, version, health, API docs, and dependency context.',
        successSignal: 'The learner can name the service owner and one dependency to check during an incident.',
        duration: '5 minutes',
        difficulty: 'Introductory',
        runtimeStatus: inactiveRuntime,
      },
    ],
    guide: {
      objective:
        'Generate activity, follow it through metrics, logs, traces, and registry metadata, then explain the system behavior from evidence.',
      prerequisites: [
        'Local DistributedLab environment is running.',
        'Metrics, logs, traces, and registry views are reachable from the control panel.',
        'At least one service interaction can be triggered safely.',
      ],
      setupCheck:
        'Open the Observability Suite module and confirm service health plus at least one recent event are visible.',
      steps: [
        {
          title: 'Generate activity',
          instruction: 'Run a simple request or lab action that touches more than one service.',
          observation: 'The dashboard receives fresh activity and the request has a correlation ID or timestamp.',
        },
        {
          title: 'Inspect metrics',
          instruction: 'Open the metrics view for the services involved in the request.',
          observation: 'Request rate, latency, or error counters change near the time of the action.',
        },
        {
          title: 'Review logs',
          instruction: 'Filter logs by service, timestamp, or correlation ID.',
          observation: 'Structured log fields connect the visible event to a specific service path.',
        },
        {
          title: 'Correlate one request',
          instruction: 'Open the trace and follow spans across service boundaries.',
          observation: 'The trace shows hop order, duration, and the slowest service span.',
        },
        {
          title: 'Inspect registry context',
          instruction: 'Open the registry entry for the slowest or most relevant service.',
          observation: 'Owner, version, health, API docs, and dependencies provide next-action context.',
        },
      ],
      observationChecklist: [
        'Metric changes line up with request timing.',
        'Logs include structured context for the same activity.',
        'Trace spans show service hop order and duration.',
        'Registry metadata identifies owner and dependency context.',
      ],
      validation: [
        'The learner can describe one request using a metric, log line, trace, and registry entry.',
        'The identified service and dependency match the topology shown in the control panel.',
      ],
      cleanup: 'Clear any temporary filters and return dashboards to the default time window.',
      nextSteps: ['Repeat the same observation path while another lab module is running a fault.'],
    },
  },
];
