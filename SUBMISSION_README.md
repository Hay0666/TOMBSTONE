# TOMBSTONE — Submission README

## ⚰️ BURY WHAT NO LONGER SERVES.

**TOMBSTONE** is the Autonomous Product Deprecation & UI Entropy Optimization Engine — a weaponized, mathematically grounded, AI-augmented workspace where product managers identify decaying features with surgical precision and execute irreversible deprecation with a single gesture.

---

## What TOMBSTONE Is

Every living product carries the dead with it. Zombie features. Interaction patterns nobody uses. UI pathways that cost engineering cycles, dilute cognitive clarity, and silently corrode the product's value signal.

TOMBSTONE measures that decay, visualizes it, and provides the surgical instrument to excise it.

It is **not a product analytics dashboard.** It is an **execution chamber for feature debt.**

---

## How It Works

1. **The Entropy Graveyard** — An infinite graph canvas where every node is a product feature. Node radius maps to Interaction Entropy Index (IEI). Glow intensity maps to Value Drift Index (VDI). Edge thickness maps to Procedure Adherence Metric (PAM).

2. **The Deprecation Razor** — Press `[C]`, draw a cut vector across the graph. Every node intersected is sentenced. A physics cascade ripples through the canvas. The dead features collapse.

3. **The Autopsy Panel** — Four mathematical instruments per feature: IEI, VDI, PAM, ΔΦ. A 90-day interaction sparkline shows the death certificate.

4. **Commit Obsequies** — A terminal generates code diffs, JSON-LD Tombstone schemas with negative semantic tags, and a full deprecation manifest. The dead stay dead — even from AI search results.

5. **Export** — One-click `.zip` containing all schemas, diffs, and commit messages. Git-ready.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 6 (strict) |
| Build | Vite 8 |
| Canvas | @xyflow/react (React Flow v12) |
| Animation | Motion (Framer Motion) |
| State | Zustand (slices pattern) |
| Styling | Tailwind CSS 3 + CSS Custom Properties |
| Icons | Lucide React |
| Export | JSZip + FileSaver |
| Typography | JetBrains Mono (Google Fonts) |

---

## Setup

```bash
# Clone the repository
git clone <repo-url>
cd tombstone

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Environment Variables

See `.env.example` for full documentation. All keys are optional for the demo:

- `VITE_PENDO_APP_ID` — Pendo SDK App ID (telemetry)
- `VITE_MCP_ENDPOINT` — Edge function for AI-driven diffs
- `VITE_SCHEMA_SIGNING_KEY` — JSON-LD export signing

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `C` | Arm Deprecation Razor |
| `ESC` | Disarm / Cancel |
| `ENTER` | Open Commit Obsequies terminal |
| `D` | Open/close Autopsy Panel |
| `G` | Fit graph to viewport |
| `Z` | Undo last sentence |
| `/` | Command palette |
| `?` | Help overlay |

---

## Mathematical Engine

- **IEI** — Interaction Entropy Index: Shannon entropy of interaction patterns
- **PAM** — Procedure Adherence Metric: KL-divergence from ideal usage flows
- **VDI** — Value Drift Index: Cosine distance from original product value vector
- **ΔΦ** — Cognitive Load Release: Projected bit-reduction post-deprecation

---

## Known Limitations

- Razor intersection uses approximate viewport coordinates (not exact React Flow transforms)
- Pendo integration requires valid App ID for telemetry to fire
- Export signing key is placeholder — not cryptographically validated
- Demo uses synthetic seed data (28 nodes, 36 edges)

---

## Hackathon

**Mind the Product World Product Day Hackathon 2026**

Built with Antigravity IDE.

*The dead stay dead.*
