import express, { Request, Response } from 'express';
import db from '../db';
import { FoodLog, FoodLogWithDetails, CreateLogRequest, UpdateLogRequest, Food } from '../types';

const router = express.Router();

interface LogQueryResult {
  id: number;
  log_date: string;
  log_time: string;
  food_id?: number;
  meal_id?: number;
  servings: number;
  food_name?: string;
  meal_name?: string;
  created_at: Date;
}

interface MealTotals {
  total_calories: string;
  total_protein: string;
  total_carbs: string;
  total_fiber: string;
  total_fat: string;
}

// Get logs for a specific date or date range
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, start_date, end_date } = req.query;
    
    let query = `
      SELECT l.*,
             f.name as food_name,
             m.name as meal_name
      FROM food_log l
      LEFT JOIN foods f ON l.food_id = f.id
      LEFT JOIN meals m ON l.meal_id = m.id
    `;
    
    let params: string[] = [];
    let conditions: string[] = [];
    
    if (date && typeof date === 'string') {
      conditions.push(`l.log_date = $${params.length + 1}`);
      params.push(date);
    } else if (start_date && end_date && typeof start_date === 'string' && typeof end_date === 'string') {
      conditions.push(`l.log_date >= $${params.length + 1}`);
      params.push(start_date);
      conditions.push(`l.log_date <= $${params.length + 1}`);
      params.push(end_date);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY l.log_date DESC, l.log_time DESC';
    
    const result = await db.query<LogQueryResult>(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Get single log entry
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query<LogQueryResult>(`
      SELECT l.*,
             f.name as food_name,
             m.name as meal_name
      FROM food_log l
      LEFT JOIN foods f ON l.food_id = f.id
      LEFT JOIN meals m ON l.meal_id = m.id
      WHERE l.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Log entry not found' });
      return;
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching log:', error);
    res.status(500).json({ error: 'Failed to fetch log' });
  }
});

// Create log entry
router.post('/', async (req: Request<{}, {}, CreateLogRequest>, res: Response): Promise<void> => {
  try {
    const { log_date, log_time, food_id, meal_id, servings } = req.body;
    
    if (!log_date || !log_time || (!food_id && !meal_id)) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    let calories: number, protein_grams: number, carbs_grams: number, fiber_grams: number, fat_grams: number, net_carbs_grams: number;
    
    if (food_id) {
      // Log a food item
      const foodResult = await db.query<Food>('SELECT * FROM foods WHERE id = $1', [food_id]);
      
      if (foodResult.rows.length === 0) {
        res.status(404).json({ error: 'Food not found' });
        return;
      }
      
      const food = foodResult.rows[0];
      const servingMultiplier = servings || 1;
      
      calories = food.calories * servingMultiplier;
      protein_grams = food.protein_grams * servingMultiplier;
      carbs_grams = food.carbs_grams * servingMultiplier;
      fiber_grams = food.fiber_grams * servingMultiplier;
      fat_grams = food.fat_grams * servingMultiplier;
      net_carbs_grams = carbs_grams - fiber_grams;
    } else {
      // Log a meal
      const mealResult = await db.query<MealTotals>(`
        SELECT 
          SUM(f.calories * mf.servings) as total_calories,
          SUM(f.protein_grams * mf.servings) as total_protein,
          SUM(f.carbs_grams * mf.servings) as total_carbs,
          SUM(f.fiber_grams * mf.servings) as total_fiber,
          SUM(f.fat_grams * mf.servings) as total_fat
        FROM meals m
        JOIN meal_foods mf ON m.id = mf.meal_id
        JOIN foods f ON mf.food_id = f.id
        WHERE m.id = $1
        GROUP BY m.id
      `, [meal_id]);
      
      if (mealResult.rows.length === 0) {
        res.status(404).json({ error: 'Meal not found' });
        return;
      }
      
      const meal = mealResult.rows[0];
      const servingMultiplier = servings || 1;
      
      calories = parseFloat(meal.total_calories || '0') * servingMultiplier;
      protein_grams = parseFloat(meal.total_protein || '0') * servingMultiplier;
      carbs_grams = parseFloat(meal.total_carbs || '0') * servingMultiplier;
      fiber_grams = parseFloat(meal.total_fiber || '0') * servingMultiplier;
      fat_grams = parseFloat(meal.total_fat || '0') * servingMultiplier;
      net_carbs_grams = carbs_grams - fiber_grams;
    }
    
    const result = await db.query<FoodLog>(
      `INSERT INTO food_log (
        log_date, log_time, food_id, meal_id, servings,
        calories, protein_grams, carbs_grams, net_carbs_grams, fiber_grams, fat_grams
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        log_date, log_time, food_id, meal_id, servings || 1,
        calories, protein_grams, carbs_grams, net_carbs_grams, fiber_grams, fat_grams
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ error: 'Failed to create log' });
  }
});

// Update log entry
router.put('/:id', async (req: Request<{ id: string }, {}, UpdateLogRequest>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { log_date, log_time, servings } = req.body;
    
    // Get current log entry
    const currentLog = await db.query<FoodLog>('SELECT * FROM food_log WHERE id = $1', [id]);
    
    if (currentLog.rows.length === 0) {
      res.status(404).json({ error: 'Log entry not found' });
      return;
    }
    
    const log = currentLog.rows[0];
    const newServings = servings !== undefined ? servings : log.servings;
    
    // Recalculate nutritional values based on new servings
    let calories: number, protein_grams: number, carbs_grams: number, fiber_grams: number, fat_grams: number, net_carbs_grams: number;
    
    if (log.food_id) {
      const foodResult = await db.query<Food>('SELECT * FROM foods WHERE id = $1', [log.food_id]);
      const food = foodResult.rows[0];
      
      calories = food.calories * newServings;
      protein_grams = food.protein_grams * newServings;
      carbs_grams = food.carbs_grams * newServings;
      fiber_grams = food.fiber_grams * newServings;
      fat_grams = food.fat_grams * newServings;
      net_carbs_grams = carbs_grams - fiber_grams;
    } else {
      const mealResult = await db.query<MealTotals>(`
        SELECT 
          SUM(f.calories * mf.servings) as total_calories,
          SUM(f.protein_grams * mf.servings) as total_protein,
          SUM(f.carbs_grams * mf.servings) as total_carbs,
          SUM(f.fiber_grams * mf.servings) as total_fiber,
          SUM(f.fat_grams * mf.servings) as total_fat
        FROM meals m
        JOIN meal_foods mf ON m.id = mf.meal_id
        JOIN foods f ON mf.food_id = f.id
        WHERE m.id = $1
        GROUP BY m.id
      `, [log.meal_id]);
      
      const meal = mealResult.rows[0];
      
      calories = parseFloat(meal.total_calories || '0') * newServings;
      protein_grams = parseFloat(meal.total_protein || '0') * newServings;
      carbs_grams = parseFloat(meal.total_carbs || '0') * newServings;
      fiber_grams = parseFloat(meal.total_fiber || '0') * newServings;
      fat_grams = parseFloat(meal.total_fat || '0') * newServings;
      net_carbs_grams = carbs_grams - fiber_grams;
    }
    
    const result = await db.query<FoodLog>(
      `UPDATE food_log 
       SET log_date = $1, log_time = $2, servings = $3, 
           calories = $4, protein_grams = $5, carbs_grams = $6, 
           net_carbs_grams = $7, fiber_grams = $8, fat_grams = $9,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [
        log_date || log.log_date,
        log_time || log.log_time,
        newServings,
        calories,
        protein_grams,
        carbs_grams,
        net_carbs_grams,
        fiber_grams,
        fat_grams,
        id
      ]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating log:', error);
    res.status(500).json({ error: 'Failed to update log' });
  }
});

// Delete log entry
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM food_log WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Log entry not found' });
      return;
    }
    
    res.json({ message: 'Log entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({ error: 'Failed to delete log' });
  }
});

export default router;
