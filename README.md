# 🍽️ Nom Nom Tracker

A feature-complete web application for tracking daily food intake, macronutrients, and analyzing nutrition trends. Built with React, Node.js/Express, PostgreSQL, and Docker.

## 🚀 Features

### Core Functionality
- **Food Database**: Pre-loaded with 27+ common foods, with the ability to add custom foods
- **Meal Builder**: Create custom meals from multiple food items
- **Daily Logging**: Track individual foods or complete meals with customizable servings
- **Smart Macros**: Automatic calculation of net carbs (total carbs - fiber), macro percentages, and calorie breakdowns
- **Weekly Summary**: Real-time weekly overview displayed alongside daily tracking
- **Analytics Dashboard**: Comprehensive charts and trends for 7, 30, or 90-day periods

### Technical Features
- **Dockerized Architecture**: Complete multi-container setup with database, backend, and frontend
- **RESTful API**: Well-structured Express backend with proper error handling
- **Responsive Design**: Clean, modern UI that works on all screen sizes
- **Real-time Calculations**: Instant macro percentage calculations and visualizations
- **Data Persistence**: PostgreSQL database with proper migrations and seeding

## 📋 Prerequisites

- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)
- Git (for cloning the repository)

## 🛠️ Installation & Setup

### 1. Clone or navigate to the project

```bash
cd /Users/xodev/dev/code/nom-nom-tracker
```

### 2. Start the application

```bash
docker-compose up --build
```

This command will:
- Build all three containers (PostgreSQL, Backend, Frontend)
- Start the database and wait for it to be healthy
- Run database migrations automatically
- Start the backend API server
- Start the React development server

### 3. Seed the database (optional but recommended)

In a new terminal window:

```bash
docker-compose exec backend npm run seed
```

This will populate the database with 27 common foods.

### 4. Access the application

- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:3003
- **Database**: localhost:5433 (accessible with any PostgreSQL client)

## 🗄️ Database Credentials

- **Host**: localhost
- **Port**: 5433
- **Database**: nomnomtracker
- **Username**: nomnom
- **Password**: nomnom123

## 📱 Using the Application

### Dashboard
- View current date's food log
- See daily calorie and macro totals with visual breakdown
- View weekly summary at the top for informed decision-making
- Add new food or meal entries
- Delete entries if needed
- Navigate between days

### Food Database
- Browse all available foods
- Search for specific foods
- View detailed nutritional information with macro percentages
- Add custom foods with complete nutritional data
- Edit or delete custom foods
- Visual macro distribution bars

### Meal Builder
- Create custom meals from multiple food items
- Specify servings for each ingredient
- Automatic calculation of meal totals
- Save meals for quick logging
- Edit or delete meals
- View complete ingredient lists

### Analytics
- Choose time ranges: 7, 30, or 90 days
- View daily calorie trends
- Track macronutrient intake over time
- See average macro distribution
- Multiple chart types: line charts, bar charts, and pie charts
- Summary statistics for the selected period

## 🏗️ Project Structure

```
nom-nom-tracker/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.js          # Database connection
│   │   │   ├── migrate.js        # Database migrations
│   │   │   └── seed.js           # Sample data seeding
│   │   ├── routes/
│   │   │   ├── foods.js          # Food CRUD operations
│   │   │   ├── meals.js          # Meal CRUD operations
│   │   │   ├── logs.js           # Food log operations
│   │   │   └── analytics.js      # Analytics & summaries
│   │   └── server.js             # Express app setup
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js      # Main tracking interface
│   │   │   ├── FoodDatabase.js   # Food management
│   │   │   ├── MealBuilder.js    # Meal creation
│   │   │   └── Analytics.js      # Charts & trends
│   │   ├── App.js                # Main app component
│   │   ├── api.js                # API client
│   │   └── index.css             # Global styles
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## 🔌 API Endpoints

### Foods
- `GET /api/foods` - Get all foods (optional search param)
- `GET /api/foods/:id` - Get single food
- `POST /api/foods` - Create new food
- `PUT /api/foods/:id` - Update food
- `DELETE /api/foods/:id` - Delete food

### Meals
- `GET /api/meals` - Get all meals
- `GET /api/meals/:id` - Get single meal
- `POST /api/meals` - Create new meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal

### Food Log
- `GET /api/logs` - Get logs (supports date and date range params)
- `GET /api/logs/:id` - Get single log entry
- `POST /api/logs` - Create log entry
- `PUT /api/logs/:id` - Update log entry
- `DELETE /api/logs/:id` - Delete log entry

### Analytics
- `GET /api/analytics/daily/:date` - Get daily summary
- `GET /api/analytics/weekly/:start_date` - Get weekly summary
- `GET /api/analytics/range/:start_date/:end_date` - Get date range data

## 🛑 Stopping the Application

```bash
docker-compose down
```

To also remove volumes (database data):

```bash
docker-compose down -v
```

## 🔧 Development

### Run backend tests/linting (when implemented)
```bash
docker-compose exec backend npm run test
docker-compose exec backend npm run lint
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Access backend container
```bash
docker-compose exec backend sh
```

### Access database directly
```bash
docker-compose exec postgres psql -U nomnom -d nomnomtracker
```

## 📊 Database Schema

### Tables
- **foods**: Individual food items with nutritional data
- **meals**: Custom meal definitions
- **meal_foods**: Junction table linking meals to foods
- **food_log**: Daily food/meal consumption records

### Key Features
- Net carbs calculated and stored (carbs - fiber)
- Macro percentages calculated in real-time
- Proper foreign key relationships with cascade deletes
- Indexed fields for better query performance

## 🎨 Technology Stack

- **Frontend**: React 18, React Router, Recharts, Axios, date-fns
- **Backend**: Node.js, Express, PostgreSQL (pg driver), CORS, Morgan
- **Database**: PostgreSQL 15
- **DevOps**: Docker, Docker Compose
- **Development**: Nodemon (backend hot reload), React Scripts (frontend hot reload)

## 🐛 Troubleshooting

### Port conflicts
If ports 3000, 3001, or 5432 are already in use, modify the port mappings in `docker-compose.yml`.

### Database connection issues
Ensure PostgreSQL container is healthy:
```bash
docker-compose ps
```

### Frontend can't connect to backend
Check that `REACT_APP_API_URL` in frontend/.env matches your backend URL.

### Clear everything and start fresh
```bash
docker-compose down -v
docker-compose up --build
docker-compose exec backend npm run seed
```

## 🚀 Future Enhancements

Potential features for future development:
- Multi-user support with authentication
- Goal setting and progress tracking
- Barcode scanning for food entry
- Recipe management
- Export data to CSV/PDF
- Mobile app (React Native)
- Meal planning calendar
- Integration with fitness trackers

## 📄 License

This project is for personal use. Modify as needed.

## 👤 Author

Created for food tracking and macro management.

---

**Happy Tracking! 🍎🥗🍗**
