# Marble Finances — Design System

> [!IMPORTANT]
> This document is the **single source of truth** for all visual styling, component patterns, and design decisions across the Marble Finances application. It must be consulted before any UI change, new feature, or visual cleanup. **Strict adherence is mandatory.** Future refactoring and UI improvements must validate against these guidelines to prevent regression.
>
> **For developers:** CSS custom properties are defined in `src/styles.css` via the `@theme` block. Implementation details live in the codebase — this document describes the *visual intent*.

---

## 1. Design Philosophy

Marble Finances uses a **warm, soft, physical** visual language that evokes the tactile feeling of real marbles on a board. The interface should feel like a premium desktop application — never like a generic web dashboard.

### Core Principles

| Principle | Description |
|---|---|
| **Warm Minimalism** | Clean layouts with generous spacing, soft cream backgrounds, and rounded surfaces |
| **Physical Metaphor** | UI elements should feel tangible — marble blocks and cards have weight |
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
| `--color-assetGreen` | `#2FC04F` | Investments |
| `--color-assetPurple` | `#67A2F9` | Retirement |
| `--color-assetBlue` | `#C380F5` | Cash |
| `--color-assetCyan` | `#707AFF` | Company |
| `--color-assetOrange` | `#F89160` | Tangible |
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

### Chart & Marble Variants

| Asset Type | Marble Variant Token | Hex (User Choice) | Usage |
|---|---|---|---|
| Green | `--color-marble-asset-green` | `#8670FF` | Investment Marbles |
| Purple | `--color-marble-asset-purple` | `#67A2F9` | Retirement Marbles |
| Blue | `--color-marble-asset-blue` | `#C380F5` | Cash Marbles |
| Cyan | `--color-marble-asset-cyan` | `#707AFF` | Business/Company Marbles |
| Orange | `--color-marble-asset-orange` | `#F89160` | Tangible Marbles |

**The Marble Rule:** Marbles must use the `marble-` variant tokens. These are slightly darker/more saturated versions of the brand colors designed to pass **WCAG 3:1 contrast** against both the cream canvas and pure white backgrounds. This rule does *not* apply to text labels or background bubbles, which should use the primary brand tokens.
- **Active Marbles:** Use the solid `marble-` variant.
- **Inactive Marbles:** Use a faint **8% tint** of the marble color (mixed with the canvas background) to maintain category context without being distracting.
- **Ghost Marbles (Hover):** Use a translucent **40% opacity** version of the marble color for predicted range, and **70% opacity** for the specific hovered slot. Use `color-mix` to maintain token compatibility.

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
| Secondary text | — | `#4B5563` (Gray 600) |

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
| Secondary Text | 10px | Medium (500) | Normal | Descriptions, helper text (Gray 600) |
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
| Primary Modals (Add, Delete, Forward, Comparison) | 32px |
| Small Modals (Dismiss prompts) | 16px to 24px |
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

All modals must follow a strictly unified layout to maintain a professional, "app-like" experience. The standard for this layout is derived from the primary data-entry interfaces.

| Property | Spec |
|---|---|
| **Backdrop** | `fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-200 flex items-center justify-center` |
| **Container** | Centered via parent Flexbox. Avoid `absolute` positioning for the main container if possible to ensure robust centering across all viewports. |
| **Background** | Pure white (`#FFFFFF`) |
| **Radius** | `rounded-[32px]` (32px) |
| **Shadow** | `shadow-2xl` (Deep and soft) |
| **Border** | `border border-gray-100` (1px) |
| **Width** | Standard: `w-[400px]` (25rem). Settings: `max-w-md` (28rem). **Viewport Constraint:** `max-w-[80vw]` (enforced globally by ModalComponent). |
| **Padding** | `p-8` (32px) all sides. |
| **Alignment** | **Strictly Left-Aligned.** Headers, body text, and labels must start from the left margin. Never use `text-center` for primary content. |
| **Typography** | Title: `text-2xl font-black text-slate mb-6`. Labels: `text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2 block`. |
| **Animations** | **Closed:** `scale-95 translate-y-4 opacity-0`. **Open:** `scale-100 translate-y-0 opacity-100`. Transition: `duration-300`. |
| **Actions** | Positioned in a `flex justify-end gap-3 pt-4` row at the bottom. |
| **Primary Button** | Far right. `px-6 py-2.5 rounded-md text-[16px] font-bold bg-slate text-white`. |
| **Secondary Button** | Left of primary. `px-5 py-2.5 rounded-md text-[16px] font-bold text-gray-600`. |

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
| **Primary** | 24px/10px padding (`px-6 py-2.5`) · 6px radius (`rounded-md`) · Slate fill (or semantic) · White text · **16px Bold** → Hover: Black fill · Light shadow |
| **Secondary** | 20px/10px padding (`px-5 py-2.5`) · 6px radius (`rounded-md`) · Transparent fill · Gray 600 text · **16px Bold** → Hover: Gray 800 text |
| **Danger** | 24px/10px padding (`px-6 py-2.5`) · 6px radius (`rounded-md`) · Red 500 fill · White text · **16px Bold** → Hover: Red 600 fill · Light shadow |

#### Dismiss Button

The `.btn-dismiss` CSS utility class is the **single, canonical implementation** for all modal/overlay close buttons.

| Property | Value |
|---|---|
| **Position** | `absolute top-8 right-8` |
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
<div class="flex justify-end gap-3">
  <button (click)="store.executeForwardAction(undefined, false)" class="px-5 py-2.5 rounded-md text-[16px] font-bold text-gray-600 hover:text-gray-800 transition-colors interactive-element">Just Here</button>
  <button (click)="store.executeForwardAction(undefined, true)" class="px-6 py-2.5 rounded-md text-[16px] font-bold bg-slate text-white hover:bg-black transition-colors shadow-sm interactive-element">Apply Forward</button>
</div>

<button class="btn-dismiss absolute top-8 right-8 interactive-element" aria-label="Close [Modal Name]">
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
  </svg>
</button>
```

### Editable Fields

- **Interaction:** Use the I-beam (`cursor: text`) on hover.
- **Visual Cue:** Show a faint bottom border (`var(--color-border-interactive)`) on hover to indicate editability.
- **Focus State:** On focus, the border becomes solid `var(--color-slate)` (2px).
- **Submission:** Submit on Enter key press — never allow multi-line editing.
- **Selection:** Select all text on focus for easy replacement.

### Stat / Computation Items

| Element | Spec |
|---|---|
| **Container** | `--color-surface-inset` fill · 24px radius · 1px `--color-border-card` border · Inset shadow · 20px padding |
| **Item Row** | White fill · 12px/8px padding · 12px radius · 1px `--color-border-card` border · Light shadow |

### Marbles

| Element | Spec |
|---|---|
| **Solid Marble** | Full opacity `marble-` variant · 2px radius (`rounded-[2px]`) |
| **Inactive Marble** | 8% tint of `marble-` variant · Mixed with `--color-canvas` |

## Marble Types
| Element | Spec |
|---|---|
| **Half Marble** | Solid left half · Semi-transparent tinted background |
| **Ghost Marble** | 40% translucent `marble-` variant · Animated overlay |
| **Deca Marble Block** | Full opacity `marble-` variant · 4px radius (`rounded-[4px]`) · Standard shadow |
| **Penta Marble block** | Full opacity `marble-` variant · 4px radius (`rounded-[4px]`) · Light shadow |
| **Tetraconta Marble Block** | Full opacity `marble-` variant · 8px radius (`rounded-[8px]`) · Standard shadow |

### Marble Growth & Progression

Marbles and blocks follow a **Bottom-Left Foundation** model. As a balance grows, new units are added in a way that grounds the component at its bottom edge and expands upwards.

- **1x1**: Marble ($1 unit)
- **5x5**: Penta Block (25 units)
- **10x10**: Deca Block (100 units)
- **20x20**: Viginti Block (400 units)

The layout engine uses a hierarchical cellular packing system with specific density constraints:

1. **Category Column ($636$px)**: The stack is contained within a $636$px wide vertical column.
2. **Viginti Foundation ($20\times 20$)**: These solid blocks represent $400$ units and are restricted to **one per row**, spanning the full $636$px width of the column.
3. **Deca Stacking ($10\times 10$)**: Above the Viginti foundation, Deca blocks wrap with a maximum of **two per row** inside the $636$px column.
4. **Virtual Deca Cell ($316$px)**: Penta blocks and the active Dynamic Grid are nested within a $316$px virtual container (the footprint of a Deca block), ensuring smaller units are always contained in the virtual space of the immediate future bigger block.
- **Wrapping**: Items fill their respective containers (Cells -> Columns -> Foundation) from left to right, bottom to top.

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
- Buttons must have **visible focus outlines**
- All text must meet **WCAG 2.2 AA** (4.5:1 for small, 3:1 for large)
- Ensure all text on Asset or Flow backgrounds uses `--color-slate` for contrast
- Secondary text must use Gray 600 (`#4B5563`) or darker
- Positive/negative indicators must not rely on color alone — use `+`/`-` signs
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
