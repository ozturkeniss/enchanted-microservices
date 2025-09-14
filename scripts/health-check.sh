#!/bin/bash

echo "🏥 Health Check for Enchanted Microservices..."

# Check User Service
echo "Checking User Service..."
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ User Service: Healthy"
else
    echo "❌ User Service: Unhealthy"
fi

# Check Product Service
echo "Checking Product Service..."
if curl -f http://localhost:8081/health > /dev/null 2>&1; then
    echo "✅ Product Service: Healthy"
else
    echo "❌ Product Service: Unhealthy"
fi

# Check API Gateway
echo "Checking API Gateway..."
if curl -f http://localhost:8090/health > /dev/null 2>&1; then
    echo "✅ API Gateway: Healthy"
else
    echo "❌ API Gateway: Unhealthy"
fi

# Check Frontend
echo "Checking Frontend..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: Healthy"
else
    echo "❌ Frontend: Unhealthy"
fi

echo "🏥 Health check completed!"
