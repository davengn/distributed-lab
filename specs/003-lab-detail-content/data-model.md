# Data Model: Lab Detail Content Completion

## Lab Module

Represents one selectable module on the Labs page.

**Fields**:

- `id`: Stable module identifier.
- `moduleNumber`: Display order from 1 to 5.
- `name`: Module card name.
- `detailName`: Detail panel heading.
- `description`: Short module summary.
- `tags`: Concept labels shown on the module card.
- `features`: Existing Overview feature list.
- `experiments`: Experiment definitions for the Experiments tab.
- `guide`: Guide section for the Guide tab.

**Relationships**:

- Has many Experiment Definitions.
- Has one Guide Section.
- Has many Learning Outcomes through experiments and guide steps.

**Validation Rules**:

- Every module must have at least one experiment per Overview feature or a clearly documented combined experiment that covers multiple features.
- Module names and concept tags must stay consistent across Overview, Experiments, and Guide content.
- Switching modules must not retain stale experiments or guide content from the previous module.

## Experiment Definition

Represents a learner-facing activity available for a module, regardless of whether a live run is active.

**Fields**:

- `id`: Stable identifier unique within the module.
- `title`: Short learner-facing experiment name.
- `concepts`: Module concepts covered by the experiment.
- `objective`: What the learner should understand or prove.
- `setup`: What must be configured or selected before the action.
- `action`: What the learner does to run or observe the experiment.
- `expectedObservation`: What should visibly change or be noticed.
- `successSignal`: How the learner knows the experiment worked.
- `duration`: Optional estimate such as "5-10 minutes".
- `difficulty`: Optional relative level such as introductory, intermediate, or advanced.
- `runtimeStatus`: Optional live state if an experiment run is connected.

**Relationships**:

- Belongs to one Lab Module.
- Maps to one or more Overview features.
- May reference Runtime Activity State.

**Validation Rules**:

- Each experiment must include objective, action, expected observation, and success signal.
- The title must use user-facing distributed-systems language.
- Runtime state must be supplementary and must not replace the static experiment definition.

## Guide Section

Represents the structured instructions shown in the Guide tab for one module.

**Fields**:

- `objective`: One-sentence lab goal.
- `prerequisites`: Required environment or learner context.
- `setupCheck`: How the learner confirms the lab is ready.
- `steps`: Ordered guide steps.
- `observationChecklist`: What signals to watch during the lab.
- `validation`: Criteria that indicate successful completion.
- `cleanup`: Reset, stop, or restore guidance.
- `nextSteps`: Optional continuation path.

**Relationships**:

- Belongs to one Lab Module.
- References one or more Experiment Definitions by title or concept.

**Validation Rules**:

- Guide steps must be ordered and action-oriented.
- At least 90% of steps must include an observation or validation cue.
- Cleanup or next-step guidance is required when the module changes service behavior or data state.

## Guide Step

Represents one action in a module guide.

**Fields**:

- `title`: Short step name.
- `instruction`: Action the learner should take.
- `observation`: Expected result or visible signal.

**Relationships**:

- Belongs to one Guide Section.
- May reference an Experiment Definition.

**Validation Rules**:

- Step titles must be concise enough for compact tab layouts.
- Instructions must be understandable without reading source code.
- Observations must point to visible UI, service behavior, data state, logs, metrics, or traces.

## Runtime Activity State

Represents optional live status for an experiment run.

**Fields**:

- `status`: Pending, running, completed, failed, stopped, or inactive.
- `summary`: Concise live-state text.
- `lastUpdated`: Optional recency label.

**Relationships**:

- May attach to an Experiment Definition.

**State Transitions**:

- `inactive -> pending`: Learner starts or queues an activity.
- `pending -> running`: Activity begins.
- `running -> completed`: Activity finishes successfully.
- `running -> failed`: Activity fails.
- `running -> stopped`: Learner stops it.
- `completed|failed|stopped -> inactive`: Learner resets or selects a new run.

**Validation Rules**:

- Inactive state must not hide the experiment catalog.
- Failed state must include an actionable next step or clear explanation.

## Learning Outcome

Represents the concept a learner should take away from an experiment or guide.

**Fields**:

- `concept`: Distributed-systems concept.
- `evidence`: What the learner observes to confirm the concept.

**Relationships**:

- Can be produced by Experiment Definitions and Guide Steps.

**Validation Rules**:

- Every experiment must map to at least one Learning Outcome.
- Outcomes must be written in learner-facing terms, not implementation-only jargon.
