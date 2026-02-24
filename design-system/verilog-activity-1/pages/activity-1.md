# Activity 1 Page Overrides - Premium PCB Lab

> **PROJECT:** VeriLog Activity 1
> **Generated:** 2026-02-24 21:50:00

## Design Tokens (Overrides)

### Color Palette
| Role | Hex | CSS Variable |
|------|-----|--------------|
| Lab Background | `#0A0F1E` | `--color-lab-bg` |
| Grid Lines | `#1E293B` | `--color-grid` |
| Metallic Port | `#94A3B8` | `--color-port` |
| Trace (Inactive) | `#334155` | `--color-trace-off` |
| Trace (Active) | `#60A5FA` | `--color-trace-on` |
| Error/Short | `#EF4444` | `--color-error` |

### Typography
- **Technical UI:** `JetBrains Mono` or similar for labels.
- **Header:** `Inter` (Semi-Bold).

## Interaction Rules

### Magnetic Snap
- **Radius:** 20px
- **Visual Feedback:** Border glow on target node (`#60A5FA`).
- **Snap Curve:** 250ms ease-out.

### Signal Animation
- **Dot Pulse:** 2px radius glowing dots.
- **Speed:** 150px/second.
- **Gap:** 20px between dots.

## VoltMonkey Logic

### States
- **Thinking:** User dragging but not near node.
- **Alert:** Short circuit detected.
- **Happy:** Loop completed.
- **Talking:** Triggering specific instructional dialogues.
