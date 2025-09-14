#!/bin/bash

echo "🚀 Starting Enchanted Microservices..."

# Start all services
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

# Run health check
echo "🏥 Running health check..."
./scripts/health-check.sh

echo "✅ All services started!"
echo ""
echo "🌐 Access URLs:"
echo "  Frontend:     http://localhost:3000"
echo "  API Gateway:  http://localhost:8090"
echo "  User Service: http://localhost:8080"
echo "  Product Service: http://localhost:8081"
echo "  PostgreSQL:   localhost:5432"
