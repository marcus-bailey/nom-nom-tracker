#!/bin/sh
set -e

echo "🐳 Starting nom-nom-tracker backend setup..."

# Function to wait for database
wait_for_db() {
    echo "⏳ Waiting for database to be ready..."
    
    # Extract database connection details from DATABASE_URL
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    
    # Default values if extraction fails
    DB_HOST=${DB_HOST:-postgres}
    DB_PORT=${DB_PORT:-5432}
    
    echo "📡 Checking database connection to $DB_HOST:$DB_PORT..."
    
    # Wait for database to be available (max 60 seconds)
    timeout=60
    while ! nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
        timeout=$((timeout - 1))
        if [ $timeout -le 0 ]; then
            echo "❌ Database connection timeout after 60 seconds"
            exit 1
        fi
        echo "⏳ Database not ready, waiting... ($timeout seconds remaining)"
        sleep 1
    done
    
    echo "✅ Database is ready!"
}

# Function to run database migrations
run_migrations() {
    if [ "$SKIP_MIGRATIONS" = "true" ]; then
        echo "⏭️  Skipping database migrations (SKIP_MIGRATIONS=true)"
        return 0
    fi
    
    echo "🔧 Running database migrations..."
    if npm run migrate; then
        echo "✅ Database migrations completed"
    else
        echo "❌ Database migrations failed"
        exit 1
    fi
}

# Function to seed database
seed_database() {
    # Seed in development or if AUTO_SEED is explicitly true
    if [ "$AUTO_SEED" = "true" ] || [ "$NODE_ENV" = "development" ]; then
        echo "🌱 Seeding database..."
        if npm run seed; then
            echo "✅ Database seeding completed"
        else
            echo "⚠️  Database seeding failed, continuing anyway..."
        fi
    else
        echo "⏭️  Skipping database seeding (production mode)"
    fi
}

# Main setup function
main() {
    echo "🚀 Starting backend initialization..."
    
    # Wait for database
    wait_for_db
    
    # Run migrations
    run_migrations
    
    # Seed database (if applicable)
    seed_database
    
    echo "✅ Backend setup completed successfully!"
    echo "🎯 Starting application with command: $@"
    
    # Execute the main command (npm run dev, npm start, etc.)
    exec "$@"
}

# Run main function with all arguments
main "$@"
