# Macro Labels Feature Plan

## Goal
Add derived macro labels for both Food items and Meals, and display them consistently anywhere these entities are shown in `MealBuilder.tsx`, `FoodDatabase.tsx`, and `Dashboard.tsx`.

## Label Rules
- `high protein`: protein percentage >= 40
- `high fat`: fat percentage >= 40
- `low carb`: carbs percentage <= 10
- `40/40/20`: protein within 40 +/- 3, fat within 40 +/- 3, carbs within 20 +/- 3

## Implementation Steps
1. Create a shared macro-label utility in `frontend/src/utils/macroLabels.ts`.
   - Normalize percentage inputs from both number and string API shapes.
   - Derive labels using deterministic rule checks.
   - Export small typed helpers for foods, meals, and logs to avoid repeated parsing logic.

2. Create a reusable UI component in `frontend/src/components/MacroLabels.tsx`.
   - Render labels as compact pills.
   - Return `null` when no labels are present.
   - Keep props strictly typed (`readonly` array, no `any`).

3. Add shared macro-label styles in `frontend/src/components/MacroLabels.css`.
   - Provide base pill style + semantic variants for each label.
   - Ensure readability in both regular cards and selected states.

4. Integrate label rendering in `frontend/src/components/FoodDatabase.tsx`.
   - Compute labels from each `Food` item and show under item header.

5. Integrate label rendering in `frontend/src/components/MealBuilder.tsx`.
   - Show labels on each meal card.
   - Show labels next to ingredient foods in meal form lists/search where foods are displayed.

6. Integrate label rendering in `frontend/src/components/Dashboard.tsx`.
   - Show labels in Add Entry modal item list for foods and meals.
   - Show labels in Food Log rows using logged grams (computed percentages) so logged entries are covered too.

7. Validate build/type safety and address any errors introduced by the changes.
   - Run frontend typecheck/build command and fix issues.

## Notes
- Keep labels fully derived at render time (no schema migration required).
- Preserve existing API contract and component behavior.
- Keep UI changes scoped and non-breaking.
