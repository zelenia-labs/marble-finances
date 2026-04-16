You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Security rules

- Never use ^ or ~ in dependency version specifiers. Always pin exact versions.
- Always commit the lockfile. Never delete it or add it to .gitignore.
- Install scripts are disabled. If a new dependency requires a build step, it must be explicitly approved.
- New package versions must be at least 1 day old before they can be installed (release age gating is enabled).
- When adding a dependency, verify it on npmjs.com before installing.
- Prefer well-maintained packages with verified publishers and provenance.
- Run pnpm install with the lockfile present — never bypass it.
- Do not add git-based or tarball URL dependencies unless explicitly approved.
- Do not run npm update, npx npm-check-updates, or any blind upgrade command. Review each update individually.
- Use deterministic installs: prefer pnpm install --frozen-lockfile over pnpm install in CI and scripts.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
  - Import and use specific types from third-party libraries (e.g., `ChartOptions`, `TooltipItem` from `chart.js`) instead of using `any`.
  - If a type is fundamentally unknown, use `unknown` and implement type guards or narrowing before accessing properties.
  - The `@typescript-eslint/no-explicit-any` rule is strictly enforced; usage of `any` will cause lint failures.

## Angular Best Practices

- Always use standalone components over NgModules
- Always create the template in a separate HTML file, and the styles in a separate CSS file.
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Regression Protection

- ALWAYS protect your changes with unit tests.
- When refactoring existing code, update the relevant spec files to ensure existing functionality is preserved.
- When adding new features, add comprehensive unit tests that cover core logic and edge cases.
- Use `By.css` to verify the presence and styling of critical UI elements.
- For interactive components, simulate user actions (click, hover, keyboard) and verify the expected state changes.


