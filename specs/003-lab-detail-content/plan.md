# Implementation Plan: Lab Detail Content Completion

**Branch**: `003-lab-detail-content` | **Date**: 2026-05-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-lab-detail-content/spec.md`

## Summary

Complete the Labs page detail experience by replacing the placeholder Experiments and Guide tab content with curated, module-specific experiment definitions and step-by-step learner guidance. The technical approach is to extend the existing control-panel Labs data model and `LabModuleDetail` composition so each module exposes structured experiment and guide content while preserving the prototype-aligned tab behavior, compact UI density, accessibility, and responsive constraints already established by `specs/002-distributed-lab-implementation`.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 16 App Router

**Primary Dependencies**: Existing control-panel stack: Next.js, React, Tailwind CSS, Jest, React Testing Library; no new runtime dependency required

**Storage**: N/A. Content is curated UI-facing lab metadata; live experiment runtime state remains separate from this feature.

**Testing**: Extend existing Jest + React Testing Library Labs tests, especially `apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx`; run `pnpm --filter control-panel test` and `pnpm --filter control-panel build`

**Target Platform**: Local web control panel served by the Next.js dev server or Docker Compose workflow; latest two versions of Chrome, Firefox, Safari, and Edge

**Project Type**: Web application frontend content and UI composition patch inside the existing monorepo

**Performance Goals**: Keep Labs tab switching instant for five modules with static metadata; avoid blocking network calls or heavyweight assets for educational content

**Constraints**: Preserve existing module inventory, selected-module flow, Overview tab behavior, tab accessibility, dark/light mode, compact prototype styling, and service boundaries

**Scale/Scope**: Five lab modules, two currently-placeholder tabs, static experiment and guide content structures, Labs page tests, and optional visual review at desktop/tablet/mobile widths

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Gate

- **I. Code Quality & Service Boundaries**: PASS. Work is limited to `apps/control-panel` UI metadata and presentation. No backend services, schemas, or API contracts are required.
- **II. Test-First Development**: PASS with required task sequencing. Implementation tasks must update failing Labs tests for missing Experiments and Guide content before changing UI/data code.
- **III. User Experience Consistency**: PASS. The feature directly supports the mandated `select -> configure -> run -> observe` lab pattern and keeps distributed-systems terminology visible.
- **IV. Performance & Resource Standards**: PASS. Static educational content adds no containers, storage, network calls, or heavy dependencies.
- **V. Observability-First Engineering**: PASS/N/A. The feature documents observation cues for learners but does not alter the observability stack or service instrumentation.

No constitution violations require Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/003-lab-detail-content/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── labs-detail-content-contract.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
apps/control-panel/
├── src/
│   ├── app/
│   │   └── labs/
│   │       ├── page.tsx
│   │       └── __tests__/
│   │           └── labs.prototype.test.tsx
│   ├── components/
│   │   └── LabModuleDetail.tsx
│   └── lib/
│       └── lab-modules.ts
├── jest.config.js
└── package.json
```

**Structure Decision**: Keep lab-detail content close to the existing Labs metadata in `apps/control-panel/src/lib/lab-modules.ts` or a narrowly scoped companion module if the data becomes too large. Keep tab rendering in `LabModuleDetail.tsx` and page composition in `apps/control-panel/src/app/labs/page.tsx`. Extend existing Labs tests rather than creating a separate test harness.

## Phase 0: Research

Research complete in [research.md](./research.md). Decisions cover the source of truth for module content, structured static metadata, runtime-state separation, tab UI pattern, accessibility and responsive verification, and dependency policy.

## Phase 1: Design & Contracts

Design artifacts:

- [data-model.md](./data-model.md): UI-facing entities for module content, experiment definitions, guide sections, runtime activity state, and learning outcomes.
- [contracts/labs-detail-content-contract.md](./contracts/labs-detail-content-contract.md): Module-by-module content contract for Experiments and Guide tabs.
- [quickstart.md](./quickstart.md): Verification workflow for implementing and reviewing the feature.

### Post-Design Constitution Check

- **I. Code Quality & Service Boundaries**: PASS. Design confines work to the control-panel Labs UI and static educational content.
- **II. Test-First Development**: PASS. The quickstart requires Labs tests to assert missing tab content before implementation.
- **III. User Experience Consistency**: PASS. The contract uses the existing module names, concepts, tab pattern, and learner-facing lab flow.
- **IV. Performance & Resource Standards**: PASS. No new runtime dependencies or backend calls are introduced.
- **V. Observability-First Engineering**: PASS/N/A. Guides require observable learner outcomes without changing instrumentation.

## Complexity Tracking

No constitution violations.
