# Plan: Fix CI Pipeline

## Problem Summary
The CI pipeline is failing because:
1. **Backend lint violations** — `console.log` usage, `any` types, missing return types
2. **Frontend has no `lint` script** — CI skips it silently via `--if-present`
3. **No `typecheck` scripts** — type checking is only done implicitly via `build`
4. **No root-level package.json** — no aggregate `npm run lint` / `npm run test` from project root
5. **No test files exist** — `--passWithNoTests` prevents failure but there's no actual testing

## Implementation Steps

### Step 1: Fix backend lint violations
- Replace `any` in `db/index.ts` with proper types (`unknown[]` for params, `QueryResultRow` default)
- Replace `catch (error: any)` patterns in `routes/foods.ts` with `unknown` + narrowing
- Replace `foods as any` in `routes/meals.ts` with a proper type
- Allow `console.log` in migration/seed scripts (they're CLI tools, not server code)

### Step 2: Add frontend ESLint with TypeScript support
- Install `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint` as devDependencies
- Create `.eslintrc.json` extending `react-app` and `plugin:@typescript-eslint/recommended`
- Add `lint` and `lint:fix` scripts to `frontend/package.json`

### Step 3: Fix frontend lint violations
- Remove stray `console.log` in `MealBuilder.tsx`
- Replace `catch (err: any)` in `FoodDatabase.tsx` with `unknown` + narrowing
- Fix unused `catch (e)` in `ThemeProvider.tsx` to use `_e` or omit binding

### Step 4: Add `typecheck` scripts
- Backend: add `"typecheck": "tsc --noEmit"` to `package.json`
- Frontend: add `"typecheck": "tsc --noEmit"` to `package.json`

### Step 5: Add root `package.json` with aggregate scripts
- Create root `package.json` with scripts that run lint/typecheck/test across both packages
- This enables `npm run lint` and `npm run test` from project root (as referenced in `.github/copilot-instructions.md`)

### Step 6: Update CI workflow
- Add explicit `typecheck` step (separate from build) for both backend and frontend jobs
- Remove `--if-present` from frontend lint (now it has a real script)
- Pin to a single Node version (20.x) instead of matrix — this is a web app, not a library
- Update the local-ci script to match

### Step 7: Verify locally
- Run lint, typecheck, build, and test for both packages
- Confirm everything passes
