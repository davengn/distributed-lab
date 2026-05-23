# Feature Specification: DistributedLab UI Prototype Alignment Patch

**Feature Branch**: `002-distributed-lab-implementation`

**Created**: 2026-05-23

**Status**: Draft

**Input**: User description: "Plan a new spec to patch the gap and correct the UI follow references/ui-prototype.html since the first round with spec specs/001-distributed-lab-docs/ is not match the designed UI."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Match the Main Dashboard Experience (Priority: P1)

A learner opens DistributedLab and sees the same dense developer-tool control panel expressed in `references/ui-prototype.html`: fixed sidebar, compact topbar, metric cards, service health grid, active experiments table, and recent events feed.

**Why this priority**: The dashboard is the first impression and the primary proof that the implementation follows the designed UI instead of the broader first-round documentation.

**Independent Test**: Start the control panel, open the dashboard, and compare the screen against `references/ui-prototype.html` at desktop and mobile widths. The same information hierarchy, status semantics, spacing density, and responsive behavior must be visible.

**Acceptance Scenarios**:

1. **Given** the control panel is open, **When** the learner lands on the dashboard, **Then** the sidebar shows Dashboard, Labs, Chaos, and Registry with the active item styled like the prototype.
2. **Given** the dashboard has service and experiment data, **When** the learner scans the page, **Then** the metric row, Service Health panel, Active Experiments table, and Recent Events panel appear in the same order and density as the prototype.
3. **Given** a service is running, degraded, or stopped, **When** it appears in Service Health, **Then** its status pill, CPU bar, memory bar, version, and port use the prototype's color and typography conventions.
4. **Given** the viewport changes from desktop to tablet to phone, **When** the dashboard is resized, **Then** content stacks according to the prototype without clipped text, horizontal page overflow, or overlapping panels.

---

### User Story 2 - Match the Lab Modules Flow (Priority: P1)

A learner opens Labs and sees the five prototype module cards with correct module names, concept tags, icon treatment, selected state, and a module detail area with Overview, Experiments, and Guide tabs.

**Why this priority**: The Labs view is the entry point for learning modules, and the current implementation gap is most visible when the page does not match the designed card and detail interaction.

**Independent Test**: Open Labs, select each module, and verify the visible cards, selected state, module detail content, and tabs match the prototype's structure and labels.

**Acceptance Scenarios**:

1. **Given** the Labs screen is open, **When** all modules are listed, **Then** the learner sees Migration & Decomposition, Distributed Data & Consistency, Resiliency & Chaos, Workflow & Communication, and Observability Suite in prototype order.
2. **Given** a learner selects a module, **When** the module detail appears, **Then** the selected card gets the prototype accent treatment and the detail panel opens below the grid.
3. **Given** a learner switches between Overview, Experiments, and Guide tabs, **When** each tab is selected, **Then** the active tab styling and content density match the prototype.

---

### User Story 3 - Match the Chaos Console Workflow (Priority: P2)

A learner opens Chaos and sees the prototype fault injection form, active faults table, circuit breaker cards, cascading failure map, and toast behavior in one coherent workflow.

**Why this priority**: Chaos is a high-interaction screen. It needs to preserve the prototype's form layout, status feedback, and dependency visualization so learners can act and observe quickly.

**Independent Test**: Open Chaos, inject a sample fault, stop a fault, and compare the form, active faults table, circuit breaker panel, failure map, and toast feedback to the prototype.

**Acceptance Scenarios**:

1. **Given** the Chaos screen is open, **When** the learner configures a fault, **Then** the form exposes fault type, target service, duration, magnitude, and an Inject Fault action with the prototype labels and layout.
2. **Given** a fault is active, **When** it appears in the table, **Then** the row shows ID, type, target, magnitude, and a Stop action styled like the prototype.
3. **Given** circuit breaker data is available, **When** the learner views the cards, **Then** open and closed states use the prototype status pill colors and concise stats.
4. **Given** a degraded dependency exists, **When** the failure map renders, **Then** degraded and failed links use the prototype dashed amber and red conventions.

---

### User Story 4 - Match the Service Registry View (Priority: P2)

A learner opens Registry and sees the prototype service topology diagram followed by the service catalog table with status, version, image, dependencies, and port.

**Why this priority**: Registry connects the learning modules to the system topology. The first-round implementation under-represents this view compared with the prototype.

**Independent Test**: Open Registry and verify the topology layers, node labels, service statuses, and catalog table columns match the prototype.

**Acceptance Scenarios**:

1. **Given** the Registry screen is open, **When** the topology is visible, **Then** it shows Control, Gateway, Application, Services, and Data layers with prototype-style nodes and links.
2. **Given** catalog data is available, **When** the learner scans the table, **Then** each row shows service name, status, version, image type, dependencies, and port.
3. **Given** the registry has many services, **When** the viewport narrows, **Then** the table remains usable through controlled horizontal scrolling inside the panel rather than breaking the page.

---

### User Story 5 - Preserve Theme and Accessibility Fidelity (Priority: P2)

A learner can switch between light and dark mode and keep the same visual hierarchy, contrast, keyboard access, and touch usability shown in the prototype.

**Why this priority**: The prototype defines both light and dark tokens. Correctness requires parity across both themes, not only the default screen.

**Independent Test**: Toggle theme, navigate all four screens by keyboard, and check representative desktop and mobile widths for contrast, focus visibility, and non-overlapping content.

**Acceptance Scenarios**:

1. **Given** the learner toggles dark mode, **When** any screen is visible, **Then** surfaces, borders, text, status colors, and semantic fills match the dark prototype tokens.
2. **Given** the learner uses only a keyboard, **When** they move through navigation, tabs, forms, buttons, and links, **Then** focus order is predictable and focus states are visible.
3. **Given** the learner uses a touch device, **When** they interact with navigation, tabs, buttons, and stop actions, **Then** targets are large enough to tap reliably without accidental neighboring activation.

### Edge Cases

- What happens when backend data is unavailable? The UI must keep the prototype structure visible and show compact loading or empty states inside the affected panel.
- What happens when a service, experiment, event, fault, or registry label is longer than the prototype sample? The text must truncate or wrap within its panel without changing the layout unexpectedly.
- What happens when the environment is stopped? The topbar environment badge must show the stopped state without hiding navigation or page content.
- What happens when theme preference is missing? The UI must default to light mode and allow the learner to switch.
- What happens when JavaScript-driven interactions fail? The page must not show broken partial states; it must leave the learner with a visible error or unchanged state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The implemented control panel MUST treat `references/ui-prototype.html` as the source of truth for visual hierarchy, labels, screen inventory, responsive behavior, and light/dark theme behavior.
- **FR-002**: The application shell MUST expose Dashboard, Labs, Chaos, and Registry as persistent primary navigation items.
- **FR-003**: The application shell MUST show a compact topbar with the current screen title and environment running/stopped status.
- **FR-004**: The dashboard MUST show metric cards for Services, Active Experiments, System Health, and Uptime in the prototype order.
- **FR-005**: The dashboard MUST show a Service Health panel with service cards containing name, status, metadata, CPU percentage, and memory percentage.
- **FR-006**: The dashboard MUST show an Active Experiments table with experiment ID, description, module, and status.
- **FR-007**: The dashboard MUST show a Recent Events feed with timestamp, severity indicator, and event text.
- **FR-008**: The Labs screen MUST show exactly five module cards matching the prototype module names, ordering, descriptions, and concept tags.
- **FR-009**: The Labs screen MUST provide a selected module detail panel with Overview, Experiments, and Guide tabs.
- **FR-010**: The Chaos screen MUST show a fault injection form with fault type, target service, duration, magnitude, and inject action.
- **FR-011**: The Chaos screen MUST show an Active Faults table with stop controls when faults exist.
- **FR-012**: The Chaos screen MUST show circuit breaker state cards and a cascading failure map using prototype status and topology conventions.
- **FR-013**: The Registry screen MUST show a service topology diagram before the service catalog table.
- **FR-014**: The Registry service catalog MUST include service, status, version, image, dependencies, and port columns.
- **FR-015**: The UI MUST preserve the prototype's compact developer-tool density: 14px body text, restrained panel headers, 6px radii, hairline borders, and no marketing hero sections.
- **FR-016**: Status colors MUST be semantic and consistent across all screens: green for healthy/running, amber for degraded/warning, red for failed/open/destructive, purple for completed.
- **FR-017**: Light and dark modes MUST share the same component structure and swap colors consistently without component-specific visual drift.
- **FR-018**: Responsive layouts MUST match the prototype behavior: full sidebar on wide screens, icon-only sidebar on narrow screens, metric cards and panels stacking without content overlap.
- **FR-019**: All interactive elements MUST have visible hover and focus states and must be operable by keyboard.
- **FR-020**: UI labels MUST use distributed-systems learning language from the prototype and first-round specification, not internal implementation jargon.

### Key Entities

- **Prototype Screen**: A named UI surface from the prototype; includes Dashboard, Labs, Chaos, and Registry.
- **Application Shell**: Persistent navigation, topbar title, environment badge, theme toggle, and content region.
- **Metric Summary**: A compact dashboard statistic with label, value, optional sparkline, and supporting text.
- **Service Card**: A health summary for one service with status, metadata, CPU usage, and memory usage.
- **Experiment Row**: A row representing a running or completed lab activity with ID, description, module, and status.
- **Event Item**: A timestamped dashboard activity with severity and concise human-readable text.
- **Lab Module Card**: A selectable module summary with number, name, description, concept tags, and selected state.
- **Fault Row**: A chaos fault entry with ID, type, target, magnitude, and stop action.
- **Circuit Breaker Card**: A resilience status summary for one service with state, failure count, success rate, and threshold.
- **Topology Node**: A visual node in a service or failure map with label, port, status dot, and connections.
- **Theme State**: The active light or dark visual mode applied across every screen.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At 1440px, 1024px, 768px, and 375px viewport widths, all four primary screens match the prototype's screen inventory, ordering, and responsive structure with no overlapping text or controls.
- **SC-002**: A reviewer can identify every prototype-only UI element listed in FR-004 through FR-014 in the implemented control panel without opening source code.
- **SC-003**: Light and dark mode checks across all four primary screens show no contrast failures for normal text or interactive controls.
- **SC-004**: Keyboard navigation can reach every primary navigation item, tab, form control, button, and table action in a predictable visual order.
- **SC-005**: A visual review finds no marketing-style hero sections, oversized headings, gradients, decorative background effects, or one-off styles that conflict with the prototype.
- **SC-006**: The UI remains usable when backend panels are loading, empty, or in error state, with the surrounding prototype layout preserved.

## Assumptions

- `references/ui-prototype.html` is the authoritative design source for this corrective feature.
- The first-round `specs/001-distributed-lab-docs/` remains the broad product scope, while this feature narrows delivery to prototype fidelity for the existing control panel.
- Existing backend service contracts are reused unless a UI surface needs missing display fields already implied by the prototype.
- This patch does not add authentication, multi-user permissions, or new lab concepts beyond the prototype.
- Demo or fallback rows may be used only when a panel would otherwise be structurally empty during local review; real backend data should replace fallback content when available.
