# Marble Finances — Design System

> [!IMPORTANT]
> This document is the **single source of truth** for all visual styling, component patterns, and design decisions across the Marble Finances application. It must be consulted before any UI change, new feature, or visual cleanup. **Strict adherence is mandatory.** Future refactoring and UI improvements must validate against these guidelines to prevent regression.
>
> **For developers:** CSS custom properties are defined in `src/styles.css` via the `@theme` block. Implementation details live in the codebase — this document describes the *visual intent*.

---

## 1. Design Philosophy

Marble Finances uses a **warm, soft, physical** visual language that evokes the tactile feeling of real marble blocks on a board. The interface should feel like a premium desktop application — never like a generic web dashboard.

### Core Principles

| Principle | Description |
|---|---|
| **Warm Minimalism** | Clean layouts with generous spacing, soft cream backgrounds, and rounded surfaces |
| **Physical Metaphor** | UI elements should feel tangible — blocks stack, marbles roll, cards have weight |
| **Information Density** | Dense financial data presented with visual hierarchy, never overwhelming |
| **Quiet Confidence** | Subtle shadows, gentle borders, and restrained animations — never flashy |

---

## 2. Color Palette

All colors are defined as CSS custom properties in the codebase. **Do NOT introduce new colors without updating the source theme and this document.**

### Core Tokens

| CSS Variable | Hex | Role |
|---|---|---|
| `--color-canvas` | `#F5F3ED` | Page background (warm cream) |
| `--color-slate` | `#333333` | Primary text and dark surfaces |

### Asset Category Colors

| CSS Variable | Hex | Usage |
|---|---|---|
| `--color-assetGreen` | `#82C37E` | Investments, Stocks, Crypto |
| `--color-assetPurple` | `#C694F9` | Cash |
| `--color-assetBlue` | `#84ADF8` | Retirement |
| `--color-assetSand` | `#D4C3A3` | Reserved |
| `--color-assetRose` | `#F0A8A8` | Reserved |
| `--color-assetTeal` | `#82C4C3` | Reserved |
| `--color-assetStone` | `#A0AAB2` | Reserved / unknown-color fallback |

### Semantic Colors

| CSS Variable | Hex | Usage |
|---|---|---|
| `--color-flowOrange` | `#F09E6D` | Expense flow blocks |
| `--color-labelYellow` | `#F3D05F` | Labels and highlights |
| `--color-labelYellowMuted` | `#FFF9E6` | Action items card background |

### Chart Variants

Slightly desaturated versions of the asset category colors for use in data visualizations (e.g., Chart.js). Defined in code at `src/app/utils/color.util.ts`. These must stay visually in sync with the main palette.

### Gray Scale

Used for borders, dividers, and subtle surfaces. These are now formally tokenized — prefer using the named tokens over bare hex values.

| Usage | Token | Value |
|---|---|---|
| Card borders | `--color-border-card` | `#F3F4F6` (Gray 100) |
| Interactive element borders | `--color-border-interactive` | `#E5E7EB` (Gray 200) |
| Inset panel backgrounds | `--color-surface-inset` | `#F9FAFB` (Gray 50) |
| Timeline sidebar background | `--color-surface-timeline` | `#F6F5EF` |
| Timeline sidebar border | `--color-border-timeline` | `#EFEFE8` |
| Glassmorphic overlays | — | `#FFFFFF` at 50% opacity |
| Secondary text | — | `#9CA3AF` – `#6B7280` (Gray 400–500) |

### Functional Colors

| Usage | Token | Value |
|---|---|---|
| Positive change (gain) | `--color-positive` | `#10B981` (Emerald 500) |
| Negative change (loss) | `--color-negative` | `#F43F5E` (Rose 500) |
| Active indicator / Accent | `--color-accent` | `#3B82F6` (Blue 500) |
| Action item checkbox | `--color-actionIndicator` | `#D4A100` (Dark Amber) |
| Destructive actions | Red | Various red shades for text, backgrounds, and borders |


### Rules

- [NO] **Never** use raw hex values in code unless referencing a defined token
- [NO] **Never** introduce a new brand color without updating the theme and this document
- [YES] User-defined custom colors (via the color picker) are the only exception — stored in `customColors[]`

---

## 3. Typography

The application uses the **system font stack** (SF Pro on macOS, Segoe UI on Windows, etc.) — no custom web fonts are loaded.

### Type Scale

| Element | Size | Weight | Tracking | Usage |
|---|---|---|---|---|
| Hero / Year Labels | 200px | Black (900) | Tight (-0.05em) | Year identifiers on the canvas |
| Page Headings | 24px | Black (900) | Normal | Modal titles, welcome screen |
| Section Headings | 12px, UPPERCASE | Black (900) | Wide (+0.1em) | Panel headers, section titles |
| Body Labels | 10px | Bold (700) | Normal | Category names, asset labels |
| Secondary Text | 10px | Medium (500) | Normal | Descriptions, helper text (Gray 500) |
| Micro Labels | 10px, UPPERCASE | Bold (700) | Widest (+0.15em) | Badge labels, stat annotations |
| Editable Values | 10px | Black (900) | Normal | Inline-editable dollar amounts |

### Rules

- All headings use **Black (900)** weight
- Body text uses **Bold (700)** or **Medium (500)** weight
- Never use Regular (400) or Light (300) — the app should feel confident and solid
- Use **tight letter-spacing** for large display text, **wide letter-spacing** for tiny uppercase labels

---

## 4. Spacing & Layout

### Canvas Grid

| Measurement | Value | Notes |
|---|---|---|
| Canvas outer padding | 128px (all sides) | Generous breathing room around the board |
| Gap between months (horizontal) | 128px | Horizontal distance between month columns |
| Gap between year rows (vertical) | 128px | Vertical distance between year rows |

### Card Padding

| Component | Padding |
|---|---|
| Canvas Board | 64px |
| Asset Category Card | 24px |
| Computation Panel | 20px |
| Modals | 24px to 32px |
| Buttons (text) | 20px horizontal, 10px vertical |
| Buttons (icon-only) | 10px all sides |

### Rules

- Use multiples of **4px** for all spacing
- Generous whitespace is a feature, not a waste

---

## 5. Border Radius

The app uses a **heavily rounded** aesthetic. Radius ranges from functional to decorative.

| Component | Radius |
|---|---|
| Canvas Board | 40px |
| Year Card | 60px |
| Primary Modals (Add, Compare) | 32px |
| Small Modals (Delete, Forward) | 16px to 24px |
| Computation Panel | 24px |
| Action Cards (welcome) | 24px |
| Asset Category Card | 16px |
| Stat Items | 12px |
| Buttons (navigation) | Pill (fully rounded / 9999px) |

### Rules

- Larger surfaces → larger radius
- Interactive navigation elements → always **pill** (fully rounded)
- Internal panels → 12px to 24px
- Never use sharp corners (0px or 2px radius) anywhere

---

## 6. Shadows & Elevation

| Level | Values | Usage |
|---|---|---|
| Resting surface | `0 1px 2px rgba(0,0,0,0.05)` | Cards, nav buttons, canvas boards |
| Elevated surface | `0 4px 6px rgba(0,0,0,0.07)` | Secondary action cards |
| Prominent surface | `0 10px 15px rgba(0,0,0,0.1)` | Primary action cards, welcome panel |
| Modal overlay | `0 25px 50px rgba(0,0,0,0.12)` | Asset category preview on drag |
| Deep modal | `0 20px 60px rgba(0,0,0,0.08)` | Centered modal dialogs |

### Rules

- Shadows should be **soft and diffused**, never sharp or tight
- Hover states may increase shadow by one level (e.g., Resting → Elevated)
- The canvas itself has no shadow — it's the ambient surface

---

## 7. Glassmorphism & Overlays

Used sparingly for floating UI elements above the canvas.

| Pattern | Fill | Backdrop Blur | Border |
|---|---|---|---|
| Nav buttons | White at 90% opacity | Standard blur (8px) | None |
| Welcome dialog | White at 50% opacity | Standard blur (8px) | 1px White at 60% opacity |
| Year card | White at 80% opacity | Medium blur (12px) | None |
| Modal backdrop | Slate 900 at 40% opacity | Light blur (4px) | None |

### Rules

- Only floating elements should use glass effects — never cards sitting in the normal flow
- Always pair **backdrop blur** with a **semi-transparent white fill** for readability

---

## 8. Component Patterns

### Modals & Dialogs

All modals must follow a strictly unified layout to maintain a professional, "app-like" experience.

| Property | Spec |
|---|---|
| **Alignment** | **Strictly Left-Aligned.** Headers, body text, and primary actions must start from the left margin. Never use `text-center`. |
| **Headers** | `text-2xl font-black text-slate mb-6` (or `mb-2` if followed by secondary text). |
| **Padding** | Minimum `p-8` (32px) for primary containers. |
| **Width** | Typically `w-96` (384px) for standard inputs, `max-w-md` for settings. |
| **Primary Action** | Positioned in a `flex justify-start gap-3/4` row at the bottom. Primary confirm button should generally come first. |

### Performance Badges (Gains/Losses)

All percentage-based performance indicators must follow the Tonal Badge pattern for instant semantic recognition.

| Property | Spec |
|---|---|
| **Shape** | `rounded-full` (Pill) |
| **Weight** | `font-black` (900) |
| **Positive (Gain)** | Background: Emerald 100 \| Text: Emerald 800 |
| **Negative (Loss)** | Background: Rose 100 \| Text: Rose 800 |
| **Mini Badge** | `text-[9px] px-1.5 py-0.5` (used in Timeline lists). |
| **Standard Badge** | `text-[11px] px-2.5 py-1` (used in Year Groups, computations). |

### Nav Buttons (Top Bar)

| Variant | Spec |
|---|---|
| **Text Button** | 20px/10px padding · Pill radius · 1px Gray 200 border · White 90% fill · Backdrop blur · Light shadow · 12px Bold text · Wide tracking · Slate color |
| **Icon Button** | 10px padding · Pill radius · 1px Gray 200 border · White 90% fill · Backdrop blur · Light shadow · Slate icon |
| **Danger Button** | 10px padding · Pill radius · 1px Red 200 border · White 90% fill · Backdrop blur · Red 400 icon → Hover: Red 50 fill, Red 600 icon |

### Modal Buttons

| Variant | Spec |
|---|---|
| **Primary** | 24px/10px padding · 6px radius · Slate fill · White text · 12px Bold → Hover: Black fill · Light shadow |
| **Secondary** | 20px/10px padding · 6px radius · Transparent fill · Gray 500 text · 12px Bold → Hover: Gray 50 fill |
| **Danger** | 20px/10px padding · 6px radius · Red 500 fill · White text · 12px Bold → Hover: Red 600 fill · Light shadow |

### Dismiss Button

The `.btn-dismiss` CSS utility class is the **single, canonical implementation** for all modal/overlay close buttons.

| Property | Value |
|---|---|
| **Shape** | Pill (fully rounded, `border-radius: 9999px`) |
| **Padding** | Centralized in CSS (`width/height: 32px`) |
| **Resting fill** | Slate at 8% opacity (`color-mix`) |
| **Resting icon** | Slate (`var(--color-slate)`) |
| **Hover fill** | Full Slate (`var(--color-slate)`) |
| **Hover icon** | White |
| **Focus** | 2px Slate outline with 2px offset |
| **Shadow** | Resting surface level (`0 1px 2px rgba(0,0,0,0.05)`) |
| **Backdrop** | `blur(4px)` |
| **Icon** | Bootstrap Icons `x` (16×16 viewBox) centralized in CSS |
| **Aria** | Always include `aria-label="Close …"` describing the modal |

**Usage rule:** Use `class="btn-dismiss"` for every dismiss/close button in the app. Do not add ad-hoc dismiss styles — always reference this class. Position the button absolutely inside its modal container.

```html
<button class="btn-dismiss absolute top-8 right-8 interactive-element" aria-label="Close [Modal Name]">
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
  </svg>
</button>
```

### Editable Fields

- Use inline editing with a hidden underline that appears on focus (2px solid `var(--color-slate)` bottom border)
- Submit on Enter key press — never allow multi-line editing
- Select all text on focus for easy replacement

### Stat / Computation Items

| Element | Spec |
|---|---|
| **Container** | `--color-surface-inset` fill · 24px radius · 1px `--color-border-card` border · Inset shadow · 20px padding |
| **Item Row** | White fill · 12px/8px padding · 12px radius · 1px `--color-border-card` border · Light shadow |

---

## 9. Animations & Transitions

| Interaction | Spec |
|---|---|
| Hover effects | Animate **color** or **all properties** over **150ms** |
| Scale on hover (large surfaces) | Scale to **102%** |
| Scale on hover (buttons) | Scale to **105%** |
| Active press | Scale to **98%** for clickable cards |
| Celebration | Custom burst keyframe animation (defined in `styles.css`) |
| Canvas panning | Conditional **transform** transition, **500ms**, **ease-out** |
| Drag & drop | Managed by Angular CDK with custom placeholder styling |

### Rules

- Animations must be **subtle and fast** — under 300ms for hover, under 500ms for transitions
- Never animate all properties on large surfaces (performance concern)
- The celebration animation is an easter egg and should stay delightful, not distracting

---

## 10. Accessibility Minimums

- All interactive elements must show a **pointer cursor**
- Buttons must have **visible focus outlines** (ring/outline on focus)
- Color contrast must meet **WCAG AA** against the `#F5F3ED` canvas and white surfaces
- Positive/negative indicators must not rely on color alone — use `+`/`-` signs alongside green/red
- All modals must **trap focus** and support **Escape** to close
- SVG icons used as buttons must have `title` attributes or `aria-label`

---

## 11. File Organization

| Concern | Location |
|---|---|
| Theme tokens (CSS custom properties) | `src/styles.css` (`@theme` block) |
| Color utilities | `src/app/utils/color.util.ts` |
| Global styles | `src/styles.css` (below `@theme`) |
| Component styles | Inline in component `.ts` files (colocated) |
| Design system doc | `DESIGN_SYSTEM.md` (this file) |
