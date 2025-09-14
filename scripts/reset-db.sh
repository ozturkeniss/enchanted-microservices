#!/bin/bash

echo "🗄️ Resetting Enchanted Databases..."

# Stop services
docker-compose down

# Remove database volume
docker volume rm enchanted-micro_postgres_data 2>/dev/null || true

# Start services again
docker-compose up -d postgres

echo "⏳ Waiting for database to initialize..."
sleep 15

# Start all services
docker-compose up -d

echo "✅ Database reset completed!"
