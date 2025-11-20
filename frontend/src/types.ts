// Matching backend types for consistency

export interface Food {
  id: number;
  name: string;
  serving_size: string;
  serving_unit?: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fiber_grams: number;
  fat_grams: number;
  is_custom: boolean;
  created_at: string;
  net_carbs_grams?: number;
  protein_percentage?: string;
  carbs_percentage?: string;
  fat_percentage?: string;
}

export interface Meal {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  foods?: MealFood[];
  totals?: {
    calories: number;
    protein_grams: number;
    net_carbs_grams: number;
    fat_grams: number;
    protein_percentage?: string;
    carbs_percentage?: string;
    fat_percentage?: string;
  };
}

export interface MealFood {
  food_id: number;
  food_name: string;
  servings: number;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fiber_grams: number;
  fat_grams: number;
}

export interface FoodLog {
  id: number;
  log_date: string;
  log_time: string;
  food_id?: number;
  meal_id?: number;
  servings: number;
  food_name?: string;
  meal_name?: string;
  calories: number;
  protein_grams: number;
  net_carbs_grams: number;
  fat_grams: number;
  created_at: string;
}

export interface DailySummary {
  log_date: string;
  total_calories: string;
  total_protein: string;
  total_net_carbs: string;
  total_fat: string;
  protein_percentage: string;
  carbs_percentage: string;
  fat_percentage: string;
  entry_count?: number;
}

export interface WeeklySummary {
  week_start: string;
  week_end: string;
  total_calories: string;
  total_protein: string;
  total_net_carbs: string;
  total_fat: string;
  protein_percentage: string;
  carbs_percentage: string;
  fat_percentage: string;
  day_count?: number;
  daily_breakdown?: DailyBreakdown[];
}

export interface DailyBreakdown {
  date: string;
  calories: string;
  protein: string;
  net_carbs: string;
  fat: string;
}

export interface RangeSummary {
  start_date: string;
  end_date: string;
  days_count: number;
  totals: {
    calories: string;
    protein: string;
    net_carbs: string;
    fat: string;
    entries: number;
  };
  averages: {
    calories: string;
    protein: string;
    net_carbs: string;
    fat: string;
  };
  daily_data: Array<{
    date: string;
    calories: string;
    protein: string;
    net_carbs: string;
    fat: string;
    entries: number;
    protein_percentage: string;
    carbs_percentage: string;
    fat_percentage: string;
  }>;
}

// Request types
export interface CreateFoodRequest {
  name: string;
  serving_size: string;
  serving_unit?: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fiber_grams: number;
  fat_grams: number;
}

export interface CreateMealRequest {
  name: string;
  description?: string;
  foods: Array<{
    food_id: number;
    servings: number;
  }>;
}

export interface CreateLogRequest {
  log_date: string;
  log_time: string;
  food_id?: number;
  meal_id?: number;
  servings: number;
}
