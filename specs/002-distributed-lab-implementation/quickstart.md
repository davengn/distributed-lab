# Quickstart: DistributedLab UI Prototype Alignment Patch

Use this guide to verify future implementation tasks for this spec.

## 1. Review the Source Artifacts

Open these files before changing UI code:

- `references/ui-prototype.html`
- `specs/002-distributed-lab-implementation/spec.md`
- `specs/002-distributed-lab-implementation/contracts/ui-fidelity-contract.md`
- `apps/control-panel/src/styles/globals.css`
- `apps/control-panel/tailwind.config.ts`

## 2. Install Dependencies

From the repository root:

```bash
pnpm install
```

## 3. Start the Control Panel

For the frontend dev server:

```bash
pnpm --filter control-panel dev
```

For the full local sandbox:

```bash
docker compose up
```

## 4. Run Required Checks

Run the frontend build:

```bash
pnpm --filter control-panel build
```

Run tests when component/page tests are added:

```bash
pnpm --filter control-panel test
```

The control-panel test script uses `jest.config.js` at runtime because Jest 29 cannot
load `jest.config.ts` without adding `ts-node`. Keep both config files in sync if the
test environment changes.

## 5. Visual Fidelity Review

Compare the running control panel against `references/ui-prototype.html` for:

- Dashboard
- Labs
- Chaos
- Registry

Check each screen at:

- 1440px
- 1024px
- 768px
- 375px

For every viewport, verify:

- Sidebar mode matches the prototype.
- Topbar title and environment badge are visible.
- Panels appear in the prototype order.
- Status colors match the semantic contract.
- Text does not overlap or clip unexpectedly.
- Tables scroll inside panels when necessary.
- Light and dark mode both preserve layout.
- Fallback review data is visible only when Lab API/WebSocket data is absent.

## 6. Accessibility Review

Verify:

- Keyboard focus reaches sidebar items, tabs, form controls, buttons, and table actions.
- Focus states are visible in light and dark mode.
- Normal text contrast remains readable in both themes.
- Touch targets are usable on narrow screens.

## 7. Scope Guardrails

Do not introduce:

- New application screens outside Dashboard, Labs, Chaos, and Registry for this patch.
- New backend services or database schemas.
- Marketing hero sections, gradients, decorative background effects, or oversized headings.
- Hard-coded prototype data that overrides real backend data when real data is available.
