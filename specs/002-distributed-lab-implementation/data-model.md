# Data Model: DistributedLab UI Prototype Alignment Patch

This model describes UI-facing state and display entities for matching `references/ui-prototype.html`. It does not introduce new backend ownership or storage.

## Entity: PrototypeScreen

**Fields**:

- `id`: one of `dashboard`, `labs`, `chaos`, `registry`
- `title`: visible topbar title
- `navLabel`: sidebar label
- `route`: application route
- `active`: whether this screen is currently selected

**Relationships**:

- Belongs to `ApplicationShell`
- Contains screen-specific display entities

**Validation Rules**:

- Exactly four primary screens are exposed.
- The active navigation item must match the current route.
- The title must match the prototype titles: Dashboard, Lab Modules, Chaos Console, Service Registry.

## Entity: ApplicationShell

**Fields**:

- `sidebarMode`: `full` or `iconOnly`
- `environmentStatus`: `running` or `stopped`
- `theme`: `light` or `dark`
- `versionLabel`: visible version badge

**Relationships**:

- Owns `PrototypeScreen` navigation state
- Owns `ThemeState`

**Validation Rules**:

- Sidebar is full width on wide screens and icon-only below the prototype breakpoint.
- Theme toggle must update every screen without per-page drift.
- Environment badge remains visible in the topbar.

## Entity: ThemeState

**Fields**:

- `mode`: `light` or `dark`
- `tokens`: surface, text, border, accent, success, warning, danger, done, neutral, progress colors

**Relationships**:

- Applies to `ApplicationShell` and all screen components

**Validation Rules**:

- Semantic status colors must be consistent across cards, pills, tables, maps, and events.
- Theme changes must not alter layout, ordering, or visible data.

**State Transitions**:

- `light -> dark`: learner activates theme toggle
- `dark -> light`: learner activates theme toggle again

## Entity: MetricSummary

**Fields**:

- `label`: Services, Active Experiments, System Health, or Uptime
- `value`: primary displayed value
- `subtext`: optional support text
- `sparkline`: optional trend values
- `severityColor`: success, accent, warning, or neutral

**Relationships**:

- Belongs to Dashboard

**Validation Rules**:

- Metrics appear in prototype order.
- Values use tabular numeric styling where appropriate.
- Missing values show compact placeholders without resizing the card.

## Entity: ServiceCard

**Fields**:

- `name`
- `displayName`
- `status`: `running`, `degraded`, or `stopped`
- `version`
- `port`
- `cpuPercent`
- `memoryPercent`

**Relationships**:

- Belongs to Dashboard Service Health
- May appear in Registry topology/catalog

**Validation Rules**:

- CPU and memory values must be percentages from 0 to 100.
- Long service names must fit or truncate without changing grid dimensions.
- Status pill color follows global semantic status rules.

## Entity: ExperimentRow

**Fields**:

- `id`
- `description`
- `module`
- `status`: `running`, `completed`, `failed`, or `stopped`

**Relationships**:

- Belongs to Dashboard Active Experiments

**Validation Rules**:

- ID uses monospace display.
- Description truncates inside the table on narrow content widths.
- Completed status uses the done semantic color.

## Entity: EventItem

**Fields**:

- `timestamp`
- `severity`: `success`, `info`, `warning`, `error`, or `done`
- `message`
- `conceptLabel`: optional distributed-systems concept mentioned in the message

**Relationships**:

- Belongs to Dashboard Recent Events
- May be received from live event updates

**Validation Rules**:

- Newest events appear first unless the backend provides a fixed order for history.
- Timestamp remains visible and compact.
- Event text must not overflow the panel.

## Entity: LabModuleCard

**Fields**:

- `moduleNumber`: 1 through 5
- `name`
- `description`
- `tags`
- `themeClass`: module color identity
- `selected`

**Relationships**:

- Belongs to Labs
- Controls `ModuleDetail`

**Validation Rules**:

- Exactly five modules are shown in prototype order.
- Selected state uses prototype accent treatment.
- Tags use compact monospace badge styling.

**State Transitions**:

- `unselected -> selected`: learner selects a module card
- `selected -> unselected`: learner selects another module

## Entity: ModuleDetail

**Fields**:

- `selectedModuleId`
- `activeTab`: `overview`, `experiments`, or `guide`
- `featureItems`
- `emptyMessage`

**Relationships**:

- Belongs to Labs
- Depends on selected `LabModuleCard`

**Validation Rules**:

- Hidden until a module is selected.
- Active tab state must be visible.
- Detail content must stay within the panel on mobile.

**State Transitions**:

- `hidden -> visible`: learner selects a module
- `overview -> experiments -> guide`: learner changes tabs

## Entity: FaultInjectionConfig

**Fields**:

- `faultType`: latency, packet loss, kill container, memory exhaustion, or network partition
- `targetService`
- `durationSeconds`
- `magnitude`
- `submitting`
- `error`

**Relationships**:

- Belongs to Chaos
- Creates `FaultRow` on success

**Validation Rules**:

- Duration must be bounded to a usable range.
- Magnitude must be present before submit.
- Submit control disables or shows progress during submission.

**State Transitions**:

- `idle -> submitting`: learner injects a fault
- `submitting -> idle`: request succeeds or fails
- `submitting -> error`: request fails and an actionable message is shown

## Entity: FaultRow

**Fields**:

- `id`
- `type`
- `target`
- `magnitude`
- `status`
- `remainingDuration`

**Relationships**:

- Belongs to Chaos Active Faults
- May influence `TopologyNode` link status

**Validation Rules**:

- Stop action is available for active faults.
- Empty state appears in table panel when no faults exist.

**State Transitions**:

- `active -> stopping`: learner stops the fault
- `stopping -> stopped`: stop succeeds and row is removed or marked stopped
- `active -> expired`: duration elapses

## Entity: CircuitBreakerCard

**Fields**:

- `serviceName`
- `state`: `closed`, `open`, or `halfOpen`
- `failureCount`
- `successRate`
- `threshold`

**Relationships**:

- Belongs to Chaos
- May reflect active `FaultRow`

**Validation Rules**:

- Open state uses danger semantics.
- Closed state uses success semantics.
- Stats remain concise and scan-friendly.

## Entity: TopologyNode

**Fields**:

- `id`
- `label`
- `subLabel`
- `layer`: control, gateway, application, services, or data
- `status`: healthy, degraded, failed
- `connections`

**Relationships**:

- Belongs to Chaos failure map or Registry service topology

**Validation Rules**:

- Healthy links are solid neutral lines.
- Degraded links are dashed amber lines.
- Failed links are dashed red lines.
- Node labels remain legible at supported widths.

## Entity: ToastMessage

**Fields**:

- `id`
- `message`
- `severity`
- `visible`
- `dismissAfterMs`

**Relationships**:

- Belongs to ApplicationShell overlay
- Created by Chaos fault actions and other transient feedback

**Validation Rules**:

- Toasts appear bottom-right on wide screens.
- Toasts auto-dismiss without shifting page layout.
- Message text remains concise.
