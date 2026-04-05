# 🚀 Backlog & Ideas

## 🐛 Bugs
- [ ] Fix the tooltip values on cashflow items.

- [ ] Fix bug where hovering/clicking on a marble block to decrease/increase dollar value sometimes causes the rendered UI to stop working.

- [ ] Clicking on certain asset titles doesn't work (suspected visual overlapping issue).

## 💡 Features & Tech Debt
- [ ] Enhance Data Visualization Interactivity. The marbles lack immediate context. Add hover or tap event listeners to trigger tooltips displaying the exact dollar amount represented by each block.

- [ ] Breakdown the app Angular component into smaller components.

- [ ] Improve the look and feel to avoid zooming too much on the months information.
  - Currently, the UX is centered on the months information, but it requires zooming in to see the details. 
  - Critical metrics in the "Marble Finances Summary" and "Computations" cards are visually dwarfed by the main charts.
  - The months details should be displayed in a way that the user can see the details without zooming in too much.

- [ ] Add the ability to edit a month after it has been created. Use a setting icon to open the edit dialog. Provide the option to remove a month with a confirmation dialog to prevent accidental deletion.

- [ ] In the loading screen, provide the user an option to see an explanation on how to convert their data from their current CSV, XSL, text, database or any other format to the marbles CSV format that is used by the app. Add a Marbles CSV validation engine with explainability to help the user to fix any issues with the data import.

- [ ] Create a JSON file that has the same structure as the marbles.json database but with dummy data to be used for demos.

- [ ] Optimize DOM Rendering for Visualizations. If each individual square in the "marble" visualizations is a separate DOM node, scaling up to larger net worths will create layout thrashing and performance bottlenecks. Migrating these charts to HTML5 Canvas or SVG will ensure smooth rendering and fast paint times when navigating between monthly views.

- [ ] Add Vitest tests to protect computed properties, calculations, and validations.

- [ ] Add E2E tests using Playwright to protect the UI and user interactions.

## 🏃🏽 In Progress

## ✅ Finished
- [x] Reuse app-marble-stack component inside the monthly-cash-flow component.

- [x] Create a comparison tool to compare two different months. By default, the comparison should be between the latest month and the previous month.
  - The user should be able to select any two months to compare after click on the Compare action button.
  - Visualize the comparison on top of the most recent month selected. Use the same UI style of the canvas with a suitable layout to display the comparison.
  - Add an icon to dismiss the comparation results.
  - The comparison should show the differences between the two months in terms of the total value of the categories, and the rest of the computations.
  - The comparison should be done in a way that the user can easily see the differences between the two months.

- [x] Normalize the color palette using CSS custom properties. All hardcoded hex values have been moved to named tokens in the `@theme` block of `src/styles.css`. New semantic tokens were introduced for borders, surfaces, positive/negative indicators, the accent color, and action-item indicators. Chart.js colors use named class constants that mirror the tokens. The `TAILWIND_COLOR_MAP` in `color.util.ts` is documented as intentional chart-variant desaturation.

- [x] Cleanup the computed properties from the marbles.json database and any other property that is not needed. Removed 32 empty action items and 164 empty `note: ""` fields from assets.

- [x] Ensure frames of months have identical heights based on the tallest months of the year, preventing a vertical "snake effect".

- [x] Add a "new" button in the initial screen to start fresh.

- [x] Add a "unload" button in the interface to clear the session and go back to the initial screen.

- [x] Add a Sparkline in each month to show the relationship between the Cash and Investments categories.

- [x] Create a section in the UI that displays the following charts:
  - Portfolio Composition Overtime using an Area Chart.
  - Total Portfolio Value Overtime using a Line Chart.
  - Future months projections based on the historical data (editable bounds and length).

- [x] Add a section in each month to show the computed values like YTD, MTM, and others used in calculations to increase the explainability of the product.
