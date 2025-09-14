#!/bin/bash

echo "🧹 Cleaning Enchanted Microservices..."

# Stop services
docker-compose down

# Remove containers
docker-compose rm -f

# Remove images
docker rmi enchanted-user-service enchanted-product-service enchanted-api-gateway enchanted-frontend 2>/dev/null || true

# Remove volumes
docker volume rm enchanted-micro_postgres_data enchanted-micro_product_uploads 2>/dev/null || true

# Clean up dangling images
docker image prune -f

echo "✅ Cleanup completed!"
