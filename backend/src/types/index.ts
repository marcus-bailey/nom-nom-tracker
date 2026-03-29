// Database entities
export interface Food {
  id: number;
  name: string;
  serving_size: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fiber_grams: number;
  fat_grams: number;
  is_custom: boolean;
  created_at: Date;
}

export interface FoodWithCalculations extends Food {
  net_carbs_grams: number;
  protein_percentage: string;
  carbs_percentage: string;
  fat_percentage: string;
}

export interface Meal {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
}

export interface MealFood {
  id: number;
  meal_id: number;
  food_id: number;
  servings: number;
}

export interface MealFoodDetail {
  food_id: number;
  food_name: string;
  servings: number;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fiber_grams: number;
  fat_grams: number;
}

export interface MealWithTotals extends Meal {
  foods?: MealFoodDetail[];
  totals?: {
    calories: number;
    protein_grams: number;
    net_carbs_grams: number;
    fat_grams: number;
    protein_percentage: string;
    carbs_percentage: string;
    fat_percentage: string;
  };
}

export interface FoodLog {
  id: number;
  log_date: string;
  log_time: string;
  food_id?: number;
  meal_id?: number;
  servings: number;
  created_at: Date;
}

export interface FoodLogWithDetails extends FoodLog {
  food_name?: string;
  meal_name?: string;
  calories: number;
  protein_grams: number;
  net_carbs_grams: number;
  fat_grams: number;
}

// Request/Response types
export interface CreateFoodRequest {
  name: string;
  serving_size: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fiber_grams: number;
  fat_grams: number;
}

export type UpdateFoodRequest = Partial<CreateFoodRequest>;

export interface CreateMealRequest {
  name: string;
  description?: string;
  foods: Array<{
    food_id: number;
    servings: number;
  }>;
}

export interface UpdateMealRequest {
  name?: string;
  description?: string;
  foods?: Array<{
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

export type UpdateLogRequest = Partial<CreateLogRequest>;

// Analytics types
export interface DailySummary {
  log_date: string;
  total_calories: number;
  total_protein: number;
  total_net_carbs: number;
  total_fat: number;
  protein_percentage: string;
  carbs_percentage: string;
  fat_percentage: string;
  entry_count: number;
}

export interface WeeklySummary {
  week_start: string;
  week_end: string;
  total_calories: number;
  total_protein: number;
  total_net_carbs: number;
  total_fat: number;
  avg_calories: number;
  avg_protein: number;
  avg_net_carbs: number;
  avg_fat: number;
  protein_percentage: string;
  carbs_percentage: string;
  fat_percentage: string;
  day_count: number;
}

export interface MacroTrend {
  log_date: string;
  calories: number;
  protein_grams: number;
  net_carbs_grams: number;
  fat_grams: number;
}
