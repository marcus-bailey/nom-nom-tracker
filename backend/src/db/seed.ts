import db from './index';

interface SampleFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fiber: number;
  fat: number;
  serving_size: string;
  serving_unit: string;
}

const sampleFoods: SampleFood[] = [
  // Proteins
  { name: 'Chicken Breast (cooked)', calories: 165, protein: 31, carbs: 0, fiber: 0, fat: 3.6, serving_size: '100', serving_unit: 'g' },
  { name: 'Salmon (cooked)', calories: 206, protein: 22, carbs: 0, fiber: 0, fat: 13, serving_size: '100', serving_unit: 'g' },
  { name: 'Ground Beef 85/15 (cooked)', calories: 215, protein: 26, carbs: 0, fiber: 0, fat: 12, serving_size: '100', serving_unit: 'g' },
  { name: 'Eggs (large)', calories: 72, protein: 6, carbs: 0.4, fiber: 0, fat: 5, serving_size: '1', serving_unit: 'egg' },
  { name: 'Greek Yogurt (plain, nonfat)', calories: 59, protein: 10, carbs: 3.6, fiber: 0, fat: 0.4, serving_size: '100', serving_unit: 'g' },
  { name: 'Tofu (firm)', calories: 144, protein: 17, carbs: 3, fiber: 2, fat: 9, serving_size: '100', serving_unit: 'g' },
  
  // Carbs
  { name: 'Brown Rice (cooked)', calories: 112, protein: 2.6, carbs: 24, fiber: 1.8, fat: 0.9, serving_size: '100', serving_unit: 'g' },
  { name: 'White Rice (cooked)', calories: 130, protein: 2.7, carbs: 28, fiber: 0.4, fat: 0.3, serving_size: '100', serving_unit: 'g' },
  { name: 'Sweet Potato (baked)', calories: 90, protein: 2, carbs: 21, fiber: 3.3, fat: 0.2, serving_size: '100', serving_unit: 'g' },
  { name: 'Oatmeal (cooked)', calories: 71, protein: 2.5, carbs: 12, fiber: 1.7, fat: 1.5, serving_size: '100', serving_unit: 'g' },
  { name: 'Quinoa (cooked)', calories: 120, protein: 4.4, carbs: 21, fiber: 2.8, fat: 1.9, serving_size: '100', serving_unit: 'g' },
  { name: 'Whole Wheat Bread', calories: 247, protein: 13, carbs: 41, fiber: 7, fat: 3.4, serving_size: '100', serving_unit: 'g' },
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fiber: 2.6, fat: 0.3, serving_size: '1', serving_unit: 'medium' },
  { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fiber: 2.4, fat: 0.2, serving_size: '1', serving_unit: 'medium' },
  
  // Vegetables
  { name: 'Broccoli (cooked)', calories: 35, protein: 2.4, carbs: 7, fiber: 3.3, fat: 0.4, serving_size: '100', serving_unit: 'g' },
  { name: 'Spinach (raw)', calories: 23, protein: 2.9, carbs: 3.6, fiber: 2.2, fat: 0.4, serving_size: '100', serving_unit: 'g' },
  { name: 'Carrots (raw)', calories: 41, protein: 0.9, carbs: 10, fiber: 2.8, fat: 0.2, serving_size: '100', serving_unit: 'g' },
  { name: 'Bell Pepper (raw)', calories: 31, protein: 1, carbs: 6, fiber: 2.1, fat: 0.3, serving_size: '100', serving_unit: 'g' },
  { name: 'Kale (raw)', calories: 35, protein: 2.9, carbs: 4.4, fiber: 4.1, fat: 1.5, serving_size: '100', serving_unit: 'g' },
  
  // Fats
  { name: 'Avocado', calories: 160, protein: 2, carbs: 8.5, fiber: 6.7, fat: 15, serving_size: '100', serving_unit: 'g' },
  { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fiber: 12.5, fat: 50, serving_size: '100', serving_unit: 'g' },
  { name: 'Olive Oil', calories: 884, protein: 0, carbs: 0, fiber: 0, fat: 100, serving_size: '100', serving_unit: 'ml' },
  { name: 'Peanut Butter', calories: 588, protein: 25, carbs: 20, fiber: 6, fat: 50, serving_size: '100', serving_unit: 'g' },
  { name: 'Cheddar Cheese', calories: 403, protein: 25, carbs: 1.3, fiber: 0, fat: 33, serving_size: '100', serving_unit: 'g' },
  
  // Dairy
  { name: 'Whole Milk', calories: 61, protein: 3.2, carbs: 4.8, fiber: 0, fat: 3.3, serving_size: '100', serving_unit: 'ml' },
  { name: 'Skim Milk', calories: 34, protein: 3.4, carbs: 5, fiber: 0, fat: 0.1, serving_size: '100', serving_unit: 'ml' },
  
  // Protein supplements
  { name: 'Whey Protein Powder', calories: 400, protein: 80, carbs: 8, fiber: 2, fat: 8, serving_size: '100', serving_unit: 'g' },
];

async function seed(): Promise<void> {
  console.log('Seeding database with sample foods...');
  
  try {
    for (const food of sampleFoods) {
      await db.query(
        `INSERT INTO foods (name, calories, protein_grams, carbs_grams, fiber_grams, fat_grams, serving_size, serving_unit, is_custom)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false)
         ON CONFLICT (name) DO NOTHING`,
        [food.name, food.calories, food.protein, food.carbs, food.fiber, food.fat, food.serving_size, food.serving_unit]
      );
    }
    
    console.log(`✅ Successfully seeded ${sampleFoods.length} foods!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seed();
}

export default seed;
