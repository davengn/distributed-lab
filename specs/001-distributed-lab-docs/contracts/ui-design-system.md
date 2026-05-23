# UI Design System Contract

**Source**: GitHub Primer design system, adapted for a developer-tool control panel.
**Reference**: `references/brand-spec.md`

## Color Tokens

All colors are defined as CSS custom properties on `:root` (light) and swapped via `[data-theme="dark"]`.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--canvas-default` | `#ffffff` | `#0d1117` | Page background |
| `--canvas-subtle` | `#f6f8fa` | `#161b22` | Secondary surface, sidebar, inputs |
| `--canvas-inset` | `#eaeef2` | `#1c2128` | Code blocks, deep inset |
| `--fg-default` | `#1f2328` | `#e6edf3` | Primary text |
| `--fg-muted` | `#656d76` | `#8b949e` | Secondary text, captions |
| `--border-default` | `#d0d7de` | `#30363d` | Standard hairline border |
| `--border-muted` | `#d8dee4` | `#21262d` | Inner dividers |
| `--border-subtle` | `#eaeef2` | `#1c2128` | Faint row dividers |
| `--accent-fg` | `#0969da` | `#58a6ff` | Links, primary CTAs, focus rings |
| `--accent-emphasis` | `#0550ae` | `#1f6feb` | Hover/pressed for accent |
| `--accent-subtle` | `#ddf4ff` | `#1c2d41` | Soft accent surface |
| `--success-fg` | `#1a7f37` | `#3fb950` | Running states, merge, success |
| `--success-emphasis` | `#1f883d` | `#238636` | Primary green button |
| `--success-subtle` | `#dafbe1` | `#1a3028` | Success surface tint |
| `--danger-fg` | `#cf222e` | `#f85149` | Closed, destructive, error |
| `--danger-subtle` | `#ffebe9` | `#3d1a1a` | Error surface |
| `--attention-fg` | `#9a6700` | `#d29922` | Warning, degraded state |
| `--attention-subtle` | `#fff8c5` | `#3d2e00` | Warning surface |
| `--done-fg` | `#8250df` | `#bc8cff` | Completed, merged-archived |
| `--done-subtle` | `#fbefff` | `#2a1f47` | Done surface |
| `--neutral-muted` | `#eaeef2` | `#30363d` | Hover background, muted fills |
| `--progress-bg` | `#eaeef2` | `#21262d` | Progress bar track |

## Typography

| Role | Font Stack |
|---|---|
| Body / UI | `-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif` |
| Code / Mono | `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace` |

### Type Scale

| Role | Size | Weight | Notes |
|---|---|---|---|
| Metric value | 24px | 600 | Dashboard KPI numbers |
| Section heading | 14px | 600 | Panel titles |
| Body | 14px | 400 | Default — density is the identity |
| Table cell | 13px | 400 | Slightly tighter |
| Caption / meta | 12px | 400–500 | Service names, file paths |
| Mono / code | 12px | 400 | `font-variant-numeric: tabular-nums` |
| Tag / badge | 11px | 400 | Module tags, version badge |

No custom web fonts. System-ui renders instantly on every OS.

## Layout Rules

1. **Density over whitespace.** 14px body, 8–12px cell padding, 16px panel padding. Information per square inch is the brand.
2. **Hairline borders, no shadows.** Panels, cards, and tables use 1px `--border-default` borders. No drop shadows except toasts (`0 4px 12px rgba(0,0,0,0.1)`).
3. **6px border-radius.** Buttons, inputs, cards, panels — all 6px. Status pills are `9999px` (full round).
4. **One accent color (Primer blue).** Used for links, active tabs, focus rings, and primary CTAs. Nothing else is blue. Success green is the only other allowed emphasis color, reserved for "running" states and the inject-fault button.
5. **Status-driven color semantics.** Green = running/healthy, amber = degraded/warning, red = failed/open, purple = completed. These are the only four non-neutral, non-accent colors.
6. **Sidebar: 240px**, collapses to 56px icon-only below 860px.
7. **Content max-width: unbounded** — this is a control panel, not a marketing page. Panels fill the viewport.

## Component Specifications

### Buttons

- 6px radius, 5px 16px padding
- **Primary** = `--success-emphasis` background, white text
- **Danger** = outline red (`--danger-fg`), fills red on hover with white text
- **Default** = `--canvas-subtle` background, `--btn-border` border

### Status Pills

- `display: inline-flex`, 2px 10px padding, `9999px` radius
- Colored dot via `::before` pseudo-element (6px circle)
- Variants: `.status-running` (green), `.status-degraded` (amber), `.status-stopped` (gray), `.status-open` (red), `.status-closed` (green), `.status-completed` (purple)

### Data Tables

- No row striping
- Hairline row borders using `--border-subtle`
- Monospace font for IDs, ports, versions (`.mono` class)
- 8px 12px cell padding

### Progress Bars

- 6px height, 3px radius
- Track: `--progress-bg`
- Fill colors: green (`--success-fg`), amber (`--attention-fg`), red (`--danger-fg`) based on threshold

### Sparklines

- SVG `<polyline>`, 1.5px stroke, no fill, 28px height
- Stroke colors: `--success-fg`, `--accent-fg`, `--attention-fg` per metric type

### Topology Diagrams

- SVG nodes with `--canvas-default` fill, `--border-default` stroke
- Healthy connections: solid `--border-default` lines
- Degraded connections: dashed `--attention-fg` lines
- Failed connections: dashed `--danger-fg` lines

### Service Cards

- `border: 1px solid var(--border-default)`, 6px radius, 12px padding
- Hover: `border-color: var(--accent-fg)`
- Progress bars for CPU/MEM with colored fills

### Panels

- `border: 1px solid var(--border-default)`, 6px radius
- Panel header: `--canvas-subtle` background, `--border-default` bottom border, 12px 16px padding
- Panel body: 16px padding

### Toasts

- Fixed position: `bottom: 24px`, `right: 24px`
- `--canvas-subtle` background, `--border-default` border
- Box shadow: `0 4px 12px rgba(0,0,0,0.1)` — the only allowed drop shadow
- Slide-in animation (200ms ease-out)
- Auto-dismiss after 3 seconds with fade-out

## Dark Mode

Toggle via `data-theme="dark"` on `<html>`. All tokens swap in one CSS block — no component-level overrides needed.

Dark surfaces shift to navy-black (`#0d1117` / `#161b22`), borders to `#30363d`, text to `#e6edf3`. Accent and semantic colors brighten slightly to maintain contrast.

## Module Icon Colors

Each lab module has a unique icon color pair (light background + foreground):

| Module | Light BG | Light FG | Dark BG | Dark FG |
|--------|----------|----------|---------|---------|
| 01 Migration | `#E1F5EE` | `#0F6E56` | `#0F3D2E` | `#3fb950` |
| 02 Consistency | `#E6F1FB` | `#185FA5` | `#0D2942` | `#58a6ff` |
| 03 Chaos | `#FAECE7` | `#993C1D` | `#3D1F14` | `#f0883e` |
| 04 Workflow | `#FAEEDA` | `#854F0B` | `#3D2E00` | `#d29922` |
| 05 Observability | `#EEEDFE` | `#534AB7` | `#2A1F47` | `#bc8cff` |

## Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| > 1100px | Full layout: 4-column metrics, 2-column panels |
| 860–1100px | Sidebar collapses to 56px icon-only; grids adjust to 2-column |
| 600–860px | Single column layout; sidebar icon-only |
| < 600px | Single column; stacked metric cards; stacked service grid |

## Prohibitions

- No gradients on backgrounds or buttons
- No emoji as feature icons
- No hero images or marketing copy — show the product
- No Inter, Roboto, or Arial as a display face
- No invented metrics without a source
- No drop shadows except on floating elements (toasts, dropdowns)
