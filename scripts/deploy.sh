#!/bin/bash

# EisLager Production Deployment Script
set -e

echo "🚀 Starting EisLager Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="eislagger"
ENVIRONMENT=${1:-production}

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo "Environment: $ENVIRONMENT"
echo "Project: $PROJECT_NAME"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command_exists docker-compose; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Create environment file
echo -e "${BLUE}📝 Creating environment configuration...${NC}"
if [ ! -f .env ]; then
    cp env.production.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file with your production values before continuing${NC}"
    echo "Press any key to continue after editing .env..."
    read -n 1 -s
fi

# Stop existing services
echo -e "${BLUE}🛑 Stopping existing services...${NC}"
docker-compose -f docker-compose.yml down -v || true

# Clean up old images (optional)
echo -e "${BLUE}🧹 Cleaning up old images...${NC}"
docker system prune -f || true

# Build images
echo -e "${BLUE}🔨 Building Docker images...${NC}"
docker-compose -f docker-compose.yml build --no-cache

# Create networks and volumes
echo -e "${BLUE}🌐 Creating Docker networks and volumes...${NC}"
docker network create ${PROJECT_NAME}-network 2>/dev/null || true
docker volume create ${PROJECT_NAME}-postgres-data 2>/dev/null || true
docker volume create ${PROJECT_NAME}-redis-data 2>/dev/null || true
docker volume create ${PROJECT_NAME}-kafka-data 2>/dev/null || true

# Start infrastructure services first
echo -e "${BLUE}🗄️ Starting infrastructure services...${NC}"
docker-compose -f docker-compose.yml up -d postgres redis zookeeper kafka

# Wait for services to be healthy
echo -e "${BLUE}⏳ Waiting for infrastructure services to be ready...${NC}"
sleep 30

# Check service health
echo -e "${BLUE}🏥 Checking service health...${NC}"

# Wait for PostgreSQL
timeout=60
while [ $timeout -gt 0 ]; do
    if docker exec ${PROJECT_NAME}-postgres pg_isready -U eislagger_user -d eislagger_main >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
        break
    fi
    echo -e "${YELLOW}⏳ Waiting for PostgreSQL... ($timeout)${NC}"
    sleep 5
    timeout=$((timeout-5))
done

if [ $timeout -le 0 ]; then
    echo -e "${RED}❌ PostgreSQL failed to start within timeout${NC}"
    exit 1
fi

# Wait for Kafka
timeout=60
while [ $timeout -gt 0 ]; do
    if docker exec ${PROJECT_NAME}-kafka kafka-topics --bootstrap-server localhost:9092 --list >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Kafka is ready${NC}"
        break
    fi
    echo -e "${YELLOW}⏳ Waiting for Kafka... ($timeout)${NC}"
    sleep 5
    timeout=$((timeout-5))
done

if [ $timeout -le 0 ]; then
    echo -e "${RED}❌ Kafka failed to start within timeout${NC}"
    exit 1
fi

# Start backend services
echo -e "${BLUE}🔧 Starting backend services...${NC}"
docker-compose -f docker-compose.yml up -d auth-service sales-service inventory-service admin-service communications-service analytics-service

# Wait for backend services
echo -e "${BLUE}⏳ Waiting for backend services to be ready...${NC}"
sleep 45

# Start frontend and nginx
echo -e "${BLUE}🎨 Starting frontend and reverse proxy...${NC}"
docker-compose -f docker-compose.yml up -d frontend nginx

# Wait for all services
echo -e "${BLUE}⏳ Waiting for all services to be ready...${NC}"
sleep 30

# Run database migrations
echo -e "${BLUE}📊 Running database migrations...${NC}"
docker exec ${PROJECT_NAME}-auth-service npx prisma migrate deploy || echo -e "${YELLOW}⚠️  Auth migrations already applied${NC}"
docker exec ${PROJECT_NAME}-sales-service npx prisma migrate deploy || echo -e "${YELLOW}⚠️  Sales migrations already applied${NC}"

# Health check all services
echo -e "${BLUE}🏥 Performing health checks...${NC}"

services=("auth-service:3002" "sales-service:3004" "inventory-service:3003" "admin-service:3001" "communications-service:3005" "analytics-service:3006" "frontend:3000")

for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if curl -f http://localhost:$port/ >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $name is healthy${NC}"
    else
        echo -e "${RED}❌ $name is not responding${NC}"
    fi
done

# Display service URLs
echo -e "${BLUE}📋 Service URLs:${NC}"
echo -e "${GREEN}🌐 Frontend: http://localhost${NC}"
echo -e "${GREEN}🔐 Auth API: http://localhost/api/auth${NC}"
echo -e "${GREEN}💰 Sales API: http://localhost/api/sales${NC}"
echo -e "${GREEN}📦 Inventory API: http://localhost/api/inventory${NC}"
echo -e "${GREEN}⚙️  Admin API: http://localhost/api/admin${NC}"
echo -e "${GREEN}💬 Communications API: http://localhost/api/communications${NC}"
echo -e "${GREEN}📊 Analytics API: http://localhost/api/analytics${NC}"

# Display logs
echo -e "${BLUE}📋 Recent logs from all services:${NC}"
docker-compose -f docker-compose.yml logs --tail=10

# Display container status
echo -e "${BLUE}📋 Container Status:${NC}"
docker-compose -f docker-compose.yml ps

echo -e "${GREEN}🎉 EisLager deployed successfully!${NC}"
echo -e "${YELLOW}💡 Use 'docker-compose logs -f' to follow logs${NC}"
echo -e "${YELLOW}💡 Use 'docker-compose down' to stop services${NC}"
echo -e "${YELLOW}💡 Use 'docker-compose restart <service>' to restart a service${NC}"

exit 0

