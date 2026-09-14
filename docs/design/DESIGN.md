# DESIGN.md — MaskSim Design System Specification

## 1. Overview & Visual Direction

This design specification is derived from the approved Stitch screen:
`https://stitch.withgoogle.com/preview/4255528054541198332?node-id=8e73c5bcf3ec4eafa224208df944b21e`
and project guidelines in `AGENTS.md` and `docs/context/`.

### Visual Philosophy
- **Light & Crisp**: Pure white and very soft slate surfaces (`#FFFFFF`, `#F8FAFC`, `#F9F9FF`).
- **Restrained & Professional**: Minimalist forensic tool aesthetic; high scientific credibility without neon, glowing dashboards, or sci-fi decorations.
- **Generous Whitespace**: Spacious content layout with clear visual hierarchy (1180px–1240px desktop width).
- **Subtle Borders & Elevation**: 1px subtle structural borders (`#E5E7EB` / `#E2E8F0`), flat surfaces with soft 1px/2px shadows only on primary cards.

---

## 2. Color Palette & Design Tokens

### Core Colors
| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| `--bg-app` | `#F9F9FF` / `#F8FAFC` | Main application background |
| `--bg-surface` | `#FFFFFF` | Primary card and dialog surfaces |
| `--bg-subtle` | `#F1F5F9` | Secondary containers, metric tags, pill backgrounds |
| `--border-subtle` | `#E2E8F0` | Structural borders, dividers, table borders |
| `--border-strong` | `#CBD5E1` | Active inputs, selected pill borders |
| `--text-primary` | `#0F172A` | Primary headlines, key labels, prominent metrics |
| `--text-secondary` | `#475569` | Body copy, descriptions, secondary notes |
| `--text-muted` | `#64748B` | Subtle footnotes, timestamps, unit labels |
| `--accent-blue` | `#2563EB` | Primary CTA, active navigation, active tabs, target reticles |
| `--accent-hover` | `#1D4ED8` | Primary button hover state |
| `--accent-subtle` | `#DBEAFE` | Selected tab background, accent badges |
| `--error-red` | `#DC2626` | Synthetic detection status, harmonic peak markers |
| `--error-bg` | `#FEF2F2` | Synthetic detection alert background |
| `--success-green` | `#16A34A` | Authentic/Real detection status, verified badges |
| `--success-bg` | `#F0FDF4` | Authentic detection alert background |
| `--amber-warning`| `#D97706` | Boundary warnings, disclaimer highlights |

---

## 3. Typography

- **Primary UI & Headings**: `Geist`, `Inter`, -apple-system, system-ui, sans-serif
- **Technical Metrics / Monospace**: `JetBrains Mono`, `IBM Plex Mono`, monospace
  - *Strict Rule*: Monospace is used **only** for detector scores, thresholds, cosine similarity, model versions, request IDs, latencies, dimensions, and mathematical formulations. Monospace is never used for general body prose.

### Type Scale
- **Headline XL**: 32px / 40px, -0.025em, font-weight 700
- **Headline LG**: 24px / 32px, -0.02em, font-weight 650
- **Headline MD**: 20px / 28px, -0.015em, font-weight 600
- **Headline SM**: 16px / 24px, -0.01em, font-weight 600
- **Body LG**: 16px / 24px, font-weight 400
- **Body MD**: 14px / 20px, font-weight 400
- **Body SM**: 13px / 18px, font-weight 400
- **Label MD**: 12px / 16px, font-weight 600, letter-spacing 0.02em
- **Code LG**: 48px / 48px, font-weight 700 (Large Detector Score)
- **Code MD**: 14px / 20px, font-weight 600
- **Code SM**: 12px / 16px, font-weight 500

---

## 4. Components & Layout Rules

### Navbar
- Height: 64px, sticky top, background `#FFFFFF` with 95% opacity and backdrop blur, border-bottom `1px solid var(--border-subtle)`.
- Left: MaskSim logo + title + `v1.0-SD1.4` pill badge.
- Center: Navigation items (`Analyze`, `How It Works`, `Model`, `Dataset`, `Performance`, `History`, `About`). Active items display blue text with a 2px blue bottom border.
- Right: GitHub link, "Analyze Image" button.

### Score Scale (Linear Visualizer)
- Straight horizontal linear bar: `Real (0.00) -------- Threshold (0.50) -------- Synthetic (1.00)`.
- Soft gradient fill up to current score.
- Centered 0.50 threshold vertical tick line with label.
- Solid circular indicator pin positioned dynamically at the detector score.
- *Strict Rule*: No circular gauges or odometer dials.

### Scientific Visualization Viewer
- Viewport with coordinate axes: Frequency $u$ (vertical: +256 to -256) and Frequency $v$ (horizontal: -256 to +256).
- Central DC $(0,0)$ reticle marker.
- Filter tabs: `Combined`, `Y`, `Cb`, `Cr`.
- Right sidebar detailing: representation (`log(1 + |F(u,v)|)`), transform (`2D-RFFT Centered Shifted`), noise source (`DnCNN 20-layer residual`), spatial dimensions (`512 × 512 px`), and decimation grid harmonics explanation.
- *Strict Rule*: In mock mode, if live tensor artifacts are absent, display a calm, informative placeholder state without inventing fake metrics or harmonic coordinates.

### Forensic Tabs
- Tabs: `Overview`, `DnCNN Residual`, `Spectrum`, `Learned Mask`, `Learned Reference`, `Technical Details`.
- Pill or rounded tab style with clear active state (`bg-blue-50 text-blue-700`).

### Definition Matrix (Technical Details)
- Clean 2-column key-value grid with subtle bottom borders (`divide-y divide-slate-100`).
- Left: Label in `text-secondary`. Right: Value in monospace `text-primary`.

### Upload Dropzone
- Large border-dashed drop target with hover/focus active states.
- File format constraints clearly listed: JPEG / PNG, minimum 512×512 px, maximum 10 MB.
- Privacy note displayed below: "Images are processed for analysis and are not permanently stored by default."

### Accessibility Standards
- Semantic HTML tags (`<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`, `<button>`).
- Keyboard navigability for tabs and dropzone.
- High contrast compliant with WCAG AA (4.5:1 minimum).
- Status communicated with explicit text badges ("SYNTHETIC SIGNAL DETECTED", "LIKELY AUTHENTIC"), never color alone.
