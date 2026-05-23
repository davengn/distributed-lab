# DistributedLab Brand Spec

Source: GitHub Primer design system, adapted for a developer-tool control panel.

---

## Color Tokens

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

### Scale

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

## Layout Posture

1. **Density over whitespace.** 14px body, 8–12px cell padding, 16px panel padding. Information per square inch is the brand.
2. **Hairline borders, no shadows.** Panels, cards, and tables use 1px `--border-default` borders. No drop shadows except toasts (`0 4px 12px rgba(0,0,0,0.1)`).
3. **6px border-radius.** Buttons, inputs, cards, panels — all 6px. Status pills are `9999px` (full round).
4. **One accent color (Primer blue).** Used for links, active tabs, focus rings, and primary CTAs. Nothing else is blue. Success green is the only other allowed emphasis color, reserved for "running" states and the inject-fault button.
5. **Status-driven color semantics.** Green = running/healthy, amber = degraded/warning, red = failed/open, purple = completed. These are the only four non-neutral, non-accent colors.
6. **Sidebar: 240px**, collapses to 56px icon-only below 860px.
7. **Content max-width: unbounded** — this is a control panel, not a marketing page. Panels fill the viewport.

## Component Rules

- **Buttons:** 6px radius, 5px 16px padding. Primary = green (`--success-emphasis` white text). Danger = outline red, fills red on hover. Default = `--canvas-subtle` background.
- **Status pills:** Inline-flex, 2px 10px padding, `9999px` radius, colored dot via `::before` pseudo-element.
- **Data tables:** No row striping. Hairline row borders (`--border-subtle`). Monospace for IDs, ports, versions.
- **Progress bars:** 6px height, 3px radius, green/amber/red fill based on threshold.
- **Sparklines:** SVG polyline, 1.5px stroke, no fill, 28px height.
- **Topology diagrams:** SVG nodes with `--canvas-default` fill, `--border-default` stroke. Lines: solid for healthy, dashed amber for degraded, dashed red for failed.

## Dark Mode

Toggle via `data-theme="dark"` on `<html>`. All tokens swap in one CSS block — no component-level overrides needed. Dark surfaces shift to navy-black (`#0d1117` / `#161b22`), borders to `#30363d`, text to `#e6edf3`. Accent and semantic colors brighten slightly to maintain contrast.

## What to Avoid

- No gradients on backgrounds or buttons.
- No emoji as feature icons.
- No hero images or marketing copy — show the product.
- No Inter, Roboto, or Arial as a display face.
- No invented metrics without a source.
- No drop shadows except on floating elements (toasts, dropdowns).
