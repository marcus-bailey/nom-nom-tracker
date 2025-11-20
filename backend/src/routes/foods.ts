import express, { Request, Response } from 'express';
import db from '../db';
import { Food, FoodWithCalculations, CreateFoodRequest, UpdateFoodRequest } from '../types';

const router = express.Router();

// Helper function to calculate macro percentages
const calculateMacros = (food: Food): FoodWithCalculations => {
  const netCarbs = food.carbs_grams - food.fiber_grams;
  const totalCalories = food.calories || 0;
  
  return {
    ...food,
    net_carbs_grams: netCarbs,
    protein_percentage: totalCalories > 0 ? ((food.protein_grams * 4) / totalCalories * 100).toFixed(1) : '0',
    carbs_percentage: totalCalories > 0 ? ((netCarbs * 4) / totalCalories * 100).toFixed(1) : '0',
    fat_percentage: totalCalories > 0 ? ((food.fat_grams * 9) / totalCalories * 100).toFixed(1) : '0',
  };
};

// Get all foods with optional search
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM foods';
    let params: string[] = [];
    
    if (search && typeof search === 'string') {
      query += ' WHERE name ILIKE $1';
      params.push(`%${search}%`);
    }
    
    query += ' ORDER BY is_custom DESC, name ASC';
    
    const result = await db.query<Food>(query, params);
    const foods = result.rows.map(calculateMacros);
    
    res.json(foods);
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ error: 'Failed to fetch foods' });
  }
});

// Get single food by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query<Food>('SELECT * FROM foods WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Food not found' });
      return;
    }
    
    const food = calculateMacros(result.rows[0]);
    res.json(food);
  } catch (error) {
    console.error('Error fetching food:', error);
    res.status(500).json({ error: 'Failed to fetch food' });
  }
});

// Create new food
router.post('/', async (req: Request<{}, {}, CreateFoodRequest>, res: Response): Promise<void> => {
  try {
    const { name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size } = req.body;
    
    if (!name || calories === undefined || protein_grams === undefined || carbs_grams === undefined || fat_grams === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    const result = await db.query<Food>(
      `INSERT INTO foods (name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, is_custom)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)
       RETURNING *`,
      [name, calories, protein_grams, carbs_grams, fiber_grams || 0, fat_grams, serving_size]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating food:', error);
    if (error.code === '23505') { // Unique violation
      res.status(409).json({ error: 'A food with this name already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to create food' });
  }
});

// Update food
router.put('/:id', async (req: Request<{ id: string }, {}, UpdateFoodRequest>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size } = req.body;
    
    const result = await db.query<Food>(
      `UPDATE foods 
       SET name = $1, calories = $2, protein_grams = $3, carbs_grams = $4, 
           fiber_grams = $5, fat_grams = $6, serving_size = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [name, calories, protein_grams, carbs_grams, fiber_grams || 0, fat_grams, serving_size, id]
    );
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Food not found' });
      return;
    }
    
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating food:', error);
    if (error.code === '23505') {
      res.status(409).json({ error: 'A food with this name already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to update food' });
  }
});

// Delete food
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM foods WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Food not found' });
      return;
    }
    
    res.json({ message: 'Food deleted successfully' });
  } catch (error) {
    console.error('Error deleting food:', error);
    res.status(500).json({ error: 'Failed to delete food' });
  }
});

export default router;
