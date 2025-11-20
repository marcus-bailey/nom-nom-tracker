import db from './index';

const migrations: string[] = [
  // Foods table - stores individual food items
  `CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    calories DECIMAL(10, 2) NOT NULL,
    protein_grams DECIMAL(10, 2) NOT NULL DEFAULT 0,
    carbs_grams DECIMAL(10, 2) NOT NULL DEFAULT 0,
    fiber_grams DECIMAL(10, 2) NOT NULL DEFAULT 0,
    fat_grams DECIMAL(10, 2) NOT NULL DEFAULT 0,
    serving_size VARCHAR(100),
    serving_unit VARCHAR(50),
    is_custom BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Meals table - stores combinations of food items
  `CREATE TABLE IF NOT EXISTS meals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_custom BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Meal foods junction table
  `CREATE TABLE IF NOT EXISTS meal_foods (
    id SERIAL PRIMARY KEY,
    meal_id INTEGER NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
    food_id INTEGER NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
    servings DECIMAL(10, 2) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(meal_id, food_id)
  )`,

  // Food log entries - records what was consumed
  `CREATE TABLE IF NOT EXISTS food_log (
    id SERIAL PRIMARY KEY,
    log_date DATE NOT NULL,
    log_time TIME NOT NULL,
    food_id INTEGER REFERENCES foods(id) ON DELETE SET NULL,
    meal_id INTEGER REFERENCES meals(id) ON DELETE SET NULL,
    servings DECIMAL(10, 2) NOT NULL DEFAULT 1,
    calories DECIMAL(10, 2) NOT NULL,
    protein_grams DECIMAL(10, 2) NOT NULL,
    carbs_grams DECIMAL(10, 2) NOT NULL,
    net_carbs_grams DECIMAL(10, 2) NOT NULL,
    fiber_grams DECIMAL(10, 2) NOT NULL,
    fat_grams DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (food_id IS NOT NULL OR meal_id IS NOT NULL)
  )`,

  // Indexes for better query performance
  `CREATE INDEX IF NOT EXISTS idx_food_log_date ON food_log(log_date)`,
  `CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(name)`,
  `CREATE INDEX IF NOT EXISTS idx_meals_name ON meals(name)`,
];

async function migrate(): Promise<void> {
  console.log('Running migrations...');
  
  try {
    for (let i = 0; i < migrations.length; i++) {
      console.log(`Running migration ${i + 1}/${migrations.length}...`);
      await db.query(migrations[i]);
    }
    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrate();
}

export default migrate;
