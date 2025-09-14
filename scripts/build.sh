#!/bin/bash

echo "🐳 Building Enchanted Microservices..."

# Build all services
echo "Building User Service..."
docker build -f cmd/userservice/Dockerfile -t enchanted-user-service .

echo "Building Product Service..."
docker build -f cmd/productservice/Dockerfile -t enchanted-product-service .

echo "Building API Gateway..."
docker build -f gin-gateway/Dockerfile -t enchanted-api-gateway .

echo "Building Frontend..."
docker build -f frontend/Dockerfile -t enchanted-frontend ./frontend

echo "✅ All services built successfully!"
echo "Run 'docker-compose up' to start all services"
