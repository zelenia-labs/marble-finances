# ⚪ Marble Finances
###  Financial portfolio tracker. Featuring zoomable marble-stack UI, data analysis charts, and month-to-month comparisons. 

[![Angular](https://img.shields.io/badge/Angular-21.x-DD0031.svg?style=flat-square&logo=angular)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Signals](https://img.shields.io/badge/State-Signals-orange.svg?style=flat-square)](https://angular.dev/guide/signals)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## 🟩 The Concept

Inspired by our original FigJam board, it represents your portfolio as physical "marble stacks" on a canvas. This physical metaphor provides an immediate overview of asset distribution.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **Marble Visualization** | Marble stacks representing assets by category (Stocks, Cash, Retirement, etc). |
| **Canvas Board** | A month-by-month view of your net worth evolution. |
| **Comparison Engine** | Compare any two months to see portfolio changes, MTM and YTD performance. |
| **Projections & Analytics** | Interactive Area and Line charts for portfolio composition and future growth projections. |
| **Action Items** | Integrated task tracking. |


## 🛠️ Tech Stack

- **Framework**: [Angular](https://angular.dev)
- **State Management**: [@ngrx/signals](https://ngrx.io/guide/signals)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Charts**: [Chart.js](https://www.chartjs.org/)
- **Testing**: [Vitest](https://vitest.dev/)


## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zelenia-labs/marble-finances.git
   cd marble-finances
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run start
   ```

Navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.


## 🎨 Design Philosophy

Marble Finances follows a **Warm Minimalism** approach defined in our [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md):
- **Physical Metaphor**: UI elements have marble stacks.
- **Deep Shadows**: Soft, diffused shadows for layers and hierarchy.
- **Rounded Aesthetics**: From pill-shaped buttons to heavily rounded boards.


## 🧪 Testing & Quality

We maintain a high standard of code quality through automated checks.

- **Unit Tests**: `npm run test` (Vitest)
- **Linting**: `npm run lint` (ESLint)
- **Production Build**: `npm run build`


## 👥 Authors

- **Yolanda Santa Cruz**
- **Alejandro Cuba Ruiz**

---

<p align="center">
  Built with 💚 by Zelenia
</p>
