import express, { Request, Response } from 'express';
import { pool } from '../db';
import db from '../db';
import { Meal, MealWithTotals, CreateMealRequest, UpdateMealRequest } from '../types';

const router = express.Router();

interface MealFood {
  food_id: number;
  food_name: string;
  servings: number;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fiber_grams: number;
  fat_grams: number;
}

interface MealQueryResult extends Meal {
  foods: MealFood[] | null;
}

const calculateMealTotals = (meal: MealQueryResult): MealWithTotals => {
  const foods = meal.foods || [];
  const totals = foods.reduce((acc, food) => {
    const servings = parseFloat(String(food.servings)) || 1;
    return {
      calories: acc.calories + (food.calories * servings),
      protein_grams: acc.protein_grams + (food.protein_grams * servings),
      carbs_grams: acc.carbs_grams + (food.carbs_grams * servings),
      fiber_grams: acc.fiber_grams + (food.fiber_grams * servings),
      fat_grams: acc.fat_grams + (food.fat_grams * servings),
    };
  }, { calories: 0, protein_grams: 0, carbs_grams: 0, fiber_grams: 0, fat_grams: 0 });
  
  const netCarbs = totals.carbs_grams - totals.fiber_grams;
  const totalCalories = totals.calories || 0;
  
  return {
    ...meal,
    foods: foods as any,
    totals: {
      calories: totals.calories,
      protein_grams: totals.protein_grams,
      net_carbs_grams: netCarbs,
      fat_grams: totals.fat_grams,
    }
  };
};

// Get all meals
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.query<MealQueryResult>(`
      SELECT m.*, 
             json_agg(
               json_build_object(
                 'food_id', f.id,
                 'food_name', f.name,
                 'servings', mf.servings,
                 'calories', f.calories,
                 'protein_grams', f.protein_grams,
                 'carbs_grams', f.carbs_grams,
                 'fiber_grams', f.fiber_grams,
                 'fat_grams', f.fat_grams
               )
             ) FILTER (WHERE f.id IS NOT NULL) as foods
      FROM meals m
      LEFT JOIN meal_foods mf ON m.id = mf.meal_id
      LEFT JOIN foods f ON mf.food_id = f.id
      GROUP BY m.id
      ORDER BY m.created_at DESC
    `);
    
    const meals = result.rows.map(calculateMealTotals);
    res.json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

// Get single meal by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const result = await db.query<MealQueryResult>(`
      SELECT m.*, 
             json_agg(
               json_build_object(
                 'food_id', f.id,
                 'food_name', f.name,
                 'servings', mf.servings,
                 'calories', f.calories,
                 'protein_grams', f.protein_grams,
                 'carbs_grams', f.carbs_grams,
                 'fiber_grams', f.fiber_grams,
                 'fat_grams', f.fat_grams
               )
             ) FILTER (WHERE f.id IS NOT NULL) as foods
      FROM meals m
      LEFT JOIN meal_foods mf ON m.id = mf.meal_id
      LEFT JOIN foods f ON mf.food_id = f.id
      WHERE m.id = $1
      GROUP BY m.id
    `, [id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Meal not found' });
      return;
    }
    
    const meal = calculateMealTotals(result.rows[0]);
    res.json(meal);
  } catch (error) {
    console.error('Error fetching meal:', error);
    res.status(500).json({ error: 'Failed to fetch meal' });
  }
});

// Create new meal
router.post('/', async (req: Request<{}, {}, CreateMealRequest>, res: Response): Promise<void> => {
  const client = await pool.connect();
  
  try {
    const { name, description, foods } = req.body;
    
    if (!name || !foods || foods.length === 0) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    await client.query('BEGIN');
    
    // Create meal
    const mealResult = await client.query<Meal>(
      'INSERT INTO meals (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    
    const mealId = mealResult.rows[0].id;
    
    // Add foods to meal
    for (const food of foods) {
      await client.query(
        'INSERT INTO meal_foods (meal_id, food_id, servings) VALUES ($1, $2, $3)',
        [mealId, food.food_id, food.servings || 1]
      );
    }
    
    await client.query('COMMIT');
    
    // Fetch the complete meal
    const result = await db.query<MealQueryResult>(`
      SELECT m.*, 
             json_agg(
               json_build_object(
                 'food_id', f.id,
                 'food_name', f.name,
                 'servings', mf.servings,
                 'calories', f.calories,
                 'protein_grams', f.protein_grams,
                 'carbs_grams', f.carbs_grams,
                 'fiber_grams', f.fiber_grams,
                 'fat_grams', f.fat_grams
               )
             ) as foods
      FROM meals m
      LEFT JOIN meal_foods mf ON m.id = mf.meal_id
      LEFT JOIN foods f ON mf.food_id = f.id
      WHERE m.id = $1
      GROUP BY m.id
    `, [mealId]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating meal:', error);
    res.status(500).json({ error: 'Failed to create meal' });
  } finally {
    client.release();
  }
});

// Update meal
router.put('/:id', async (req: Request<{ id: string }, {}, UpdateMealRequest>, res: Response): Promise<void> => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const { name, description, foods } = req.body;
    
    await client.query('BEGIN');
    
    // Update meal
    await client.query(
      'UPDATE meals SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [name, description, id]
    );
    
    // Delete existing meal foods
    await client.query('DELETE FROM meal_foods WHERE meal_id = $1', [id]);
    
    // Add updated foods
    if (foods && foods.length > 0) {
      for (const food of foods) {
        await client.query(
          'INSERT INTO meal_foods (meal_id, food_id, servings) VALUES ($1, $2, $3)',
          [id, food.food_id, food.servings || 1]
        );
      }
    }
    
    await client.query('COMMIT');
    
    // Fetch updated meal
    const result = await db.query<MealQueryResult>(`
      SELECT m.*, 
             json_agg(
               json_build_object(
                 'food_id', f.id,
                 'food_name', f.name,
                 'servings', mf.servings,
                 'calories', f.calories,
                 'protein_grams', f.protein_grams,
                 'carbs_grams', f.carbs_grams,
                 'fiber_grams', f.fiber_grams,
                 'fat_grams', f.fat_grams
               )
             ) FILTER (WHERE f.id IS NOT NULL) as foods
      FROM meals m
      LEFT JOIN meal_foods mf ON m.id = mf.meal_id
      LEFT JOIN foods f ON mf.food_id = f.id
      WHERE m.id = $1
      GROUP BY m.id
    `, [id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Meal not found' });
      return;
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating meal:', error);
    res.status(500).json({ error: 'Failed to update meal' });
  } finally {
    client.release();
  }
});

// Delete meal
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM meals WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Meal not found' });
      return;
    }
    
    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({ error: 'Failed to delete meal' });
  }
});

export default router;
