# Plan: Shared Macro Display Component

1. Add a reusable macro display component
- Create a new component that renders macro title, grams/value, and percentage in a configurable way.
- Support title badge rendering so Food Database can keep colored pill indicators while other screens can omit them.
- Keep all props strictly typed (no `any`) and preserve existing output semantics.

2. Refactor Food Database to use the shared component
- Replace repeated Protein / Net Carbs / Fat card markup in each food card with the shared component.
- Preserve the existing visual output by passing Food Database-specific class names and badge classes.

3. Refactor Meal Builder to use the shared component
- Replace repeated macro blocks in meal cards and the meal form totals section with the shared component.
- Keep current formatting and percentage display behavior intact.

4. Refactor Dashboard daily/weekly summaries to use the shared component
- Replace repeated macro stat cards for daily summary and weekly averages with the shared component.
- Preserve weekly styling differences by retaining `stat-card`-based class structure.

5. Remove FoodDatabase/MealBuilder style coupling
- Introduce Meal Builder-specific macro classes for meal nutrition cards so they no longer rely on Food Database global macro selectors.
- Update Food Database macro classes to be component-scoped names.
- Ensure both pages keep current appearance.

6. Validate and summarize
- Run frontend type checks/lint if available.
- Fix any issues introduced by refactor.
- Provide a concise summary of changed files and rationale.
