# Plan: Weekly Summary → Weekly Averages Card

## Overview
Update the Weekly Summary card on the Dashboard to display **daily averages** instead of weekly totals. The averages should be computed based only on the number of days that actually have food log entries, not all 7 days of the week.

## Changes

### 1. Update Backend Types (`backend/src/types/index.ts`)
- Add `avg_calories`, `avg_protein`, `avg_net_carbs`, `avg_fat` fields to `WeeklySummary` interface.

### 2. Update Backend Analytics Route (`backend/src/routes/analytics.ts`)
- Use the `daily_breakdown` result (which already has per-day data via `GROUP BY log_date`) to compute `day_count` (number of distinct days with entries).
- Compute averages: `total / day_count` for calories, protein, net_carbs, fat.
- Return the new average fields and `day_count` in the response.

### 3. Update Frontend Types (`frontend/src/types.ts`)
- Add `avg_calories`, `avg_protein`, `avg_net_carbs`, `avg_fat` fields to `WeeklySummary` interface.
- Make `day_count` non-optional since the backend always returns it.

### 4. Update Dashboard Card Rendering (`frontend/src/components/Dashboard.tsx`)
- Rename the card header from "Week Summary" to "Weekly Averages".
- Display average values instead of totals for calories and macros.
- Show the day count (e.g., "Avg of 3 days") so the user knows how many days are included.
