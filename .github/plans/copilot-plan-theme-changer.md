# Theme Changer - Plan

Goal: Implement a site-wide theme changer (light/dark) that affects pages, components, images, backgrounds, and text.

Steps:

1. Add a ThemeProvider and context
   - Create `frontend/src/theme/ThemeProvider.tsx` which exposes a `ThemeProvider` and `useTheme` hook.
   - Manage `theme` state with `localStorage` persistence and apply the theme by setting `document.documentElement.dataset.theme`.

2. Add a theme toggle control in the header
   - Add a small toggle button in `frontend/src/App.tsx` header area.
   - Use `useTheme` to toggle between `light` and `dark`.

3. Introduce CSS variables for colors
   - Add CSS custom properties (variables) in `frontend/src/index.css` under `:root` for the light theme.
   - Add a `[data-theme="dark"]` override for dark theme variables.
   - Ensure variables cover: background, text, muted text, card backgrounds, borders, primary/accent colors, header/nav/footer backgrounds, button colors, shadows.

4. Update global styles to use variables
   - Replace hard-coded colors in `frontend/src/index.css` and `frontend/src/App.css` with `var(...)` references.
   - Keep sensible fallbacks where appropriate.

5. Add small toggle styling
   - Add `.theme-toggle` button styles in `index.css`.

6. Quick review & smoke test
   - Start dev server (or run build if available) and verify toggle persists and switches styles across views.
   - Verify primary interactive components remain readable in both themes.

Notes / Considerations:
- Most component styles already use semantic classes (e.g., `.card`, `.container`) so switching root variables should propagate widely.
- If any component uses inline styles or fixed assets that need alternate versions, open a follow-up task.
- This plan focuses on minimal, high-impact changes to provide a full-app theme switch with persistence.

Files to be created/updated:
- `frontend/src/theme/ThemeProvider.tsx` (new)
- `frontend/src/App.tsx` (modify header to include toggle and wrap in provider)
- `frontend/src/index.css` (add variables and small updates)
- `frontend/src/App.css` (replace a few hard-coded colors)

---
End of plan.
