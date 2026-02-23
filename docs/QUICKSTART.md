# Quick Start Guide

## Prerequisites Check
- [ ] Docker Desktop is installed and running
- [ ] Ports 3000, 3001, and 5432 are available

## Setup Steps

1. **Navigate to project directory**
   ```bash
   cd /Users/xodev/dev/code/nom-nom-tracker
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```
   
   Wait for all services to start (takes 2-3 minutes on first build)

3. **Create the database tables**
   ```bash
   docker-compose exec backend npm run migrate
   ```

4. **Seed the database** (in a new terminal)
   ```bash
   docker-compose exec backend npm run seed
   ```

5. **Access the app**
   - Open browser to http://localhost:3002

## Your First Session

1. **Add a food** (Food Database tab)
   - Click "+ Add Food"
   - Fill in name, calories, and macros
   - Click "Add Food"

2. **Create a meal** (Meal Builder tab)
   - Click "+ Create Meal"
   - Give it a name
   - Search and add foods
   - Adjust servings
   - Click "Create Meal"

3. **Log your intake** (Dashboard)
   - Click "+ Add Entry"
   - Choose Food or Meal
   - Search and select
   - Set servings
   - Click "Add Entry"

4. **View analytics** (Analytics tab)
   - Check your trends over 7, 30, or 90 days
   - View calorie intake and macro distribution

## Common Commands

Stop the app:
```bash
docker-compose down
```

Restart the app:
```bash
docker-compose up
```

View logs:
```bash
docker-compose logs -f
```

Reset everything:
```bash
docker-compose down -v
docker-compose up --build
docker-compose exec backend npm run seed
```

## Need Help?

Check README.md for detailed documentation and troubleshooting.
