# Database Initialization

## Overview

The nom-nom-tracker backend automatically initializes the database on container startup using a custom entrypoint script. This ensures the database is always in the correct state when the application starts.

## How It Works

### Docker Entrypoint Script

The [docker-entrypoint.sh](../backend/docker-entrypoint.sh) runs before the application starts and:

1. **Waits for database** - Uses `netcat` to check if PostgreSQL is accepting connections
2. **Runs migrations** - Executes `npm run migrate` to create/update database schema
3. **Seeds database** - Runs `npm run seed` in development mode (if `AUTO_SEED=true`)
4. **Starts application** - Hands off to the main command (`npm run dev`)

### Idempotent Operations

Both migration and seeding are **idempotent** (safe to run multiple times):

- **Migrations** use `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`
- **Seeding** uses `ON CONFLICT (name) DO NOTHING` to avoid duplicates

This means the container can be restarted safely without errors or data duplication.

## Environment Variables

### AUTO_SEED

Controls whether sample data is inserted on startup:

- `AUTO_SEED=true` - Seeds database with sample foods (development default)
- `AUTO_SEED=false` - Skips seeding (recommended for production)

### SKIP_MIGRATIONS

Allows bypassing migrations if needed:

- `SKIP_MIGRATIONS=true` - Skips migration step
- Default: migrations always run

### NODE_ENV

- `development` - Enables seeding (if AUTO_SEED=true)
- `production` - Skips seeding regardless of AUTO_SEED

## Manual Database Operations

You can still run migrations and seeding manually if needed:

```bash
# Run migrations manually
docker exec nom-nom-backend npm run migrate

# Seed database manually
docker exec nom-nom-backend npm run seed

# Check database tables
docker exec nom-nom-db psql -U nomnom -d nomnomtracker -c "\dt"
```

## Dockerfile Changes

The [Dockerfile](../backend/Dockerfile) was updated to:

1. Install `netcat-openbsd` for database connectivity checks
2. Copy and set permissions on `docker-entrypoint.sh`
3. Use `ENTRYPOINT` to run the init script before the main `CMD`

## Production Considerations

For production deployments:

1. Set `AUTO_SEED=false` to prevent seeding
2. Consider using a separate init container for one-time setup
3. Use database backups before deploying schema changes
4. Test migrations in staging environment first

## Troubleshooting

### Container fails to start with "Database connection timeout"

- Verify the database container is running: `docker ps | grep nom-nom-db`
- Check database health: `docker exec nom-nom-db pg_isready`
- Verify DATABASE_URL is correct in docker-compose.yml

### Migrations fail

- Check logs: `docker logs nom-nom-backend`
- Verify database credentials are correct
- Ensure postgres container is healthy before backend starts

### Seeding fails but container starts

- This is expected behavior - seeding failures don't prevent startup
- Check if data already exists: `docker exec nom-nom-db psql -U nomnom -d nomnomtracker -c "SELECT COUNT(*) FROM foods;"`
- Review logs for specific error messages
