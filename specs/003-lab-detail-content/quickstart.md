# Quickstart: Lab Detail Content Completion

## 1. Review the feature scope

Read:

- `specs/003-lab-detail-content/spec.md`
- `specs/003-lab-detail-content/contracts/labs-detail-content-contract.md`
- `apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx`
- `apps/control-panel/src/lib/lab-modules.ts`
- `apps/control-panel/src/components/LabModuleDetail.tsx`

## 2. Add failing coverage first

Update Labs tests so they fail while the Experiments and Guide tabs still show placeholder text.

Suggested assertions:

- Selecting each module exposes module-specific Experiments content.
- Experiments content includes objective, setup or trigger, expected observation, and success signal.
- Selecting each module exposes module-specific Guide content.
- Guide content includes objective, prerequisites, ordered steps, validation, and cleanup or next steps.
- Switching modules does not leave stale tab content visible.

Run the focused test:

```bash
pnpm --filter control-panel test -- src/app/labs/__tests__/labs.prototype.test.tsx --runInBand
```

## 3. Implement the content model and tab rendering

Use the existing Labs data and detail-panel structure. Keep the implementation scoped to:

- `apps/control-panel/src/lib/lab-modules.ts`
- `apps/control-panel/src/components/LabModuleDetail.tsx`
- `apps/control-panel/src/app/labs/page.tsx` only if page composition needs a small adjustment

Avoid new runtime dependencies and backend changes.

## 4. Verify automated checks

```bash
pnpm --filter control-panel test
pnpm --filter control-panel build
```

## 5. Verify manually

Start the control panel if needed:

```bash
pnpm --filter control-panel dev
```

Open `http://localhost:3000/labs` and verify:

- All five module cards still render in the existing order.
- Selecting a module opens the detail panel.
- Overview remains useful.
- Experiments is not a placeholder for any module.
- Guide is not a placeholder for any module.
- Keyboard tab navigation and arrow-key tab switching still work.
- Content remains readable at 1440px, 1024px, 768px, and 375px.
