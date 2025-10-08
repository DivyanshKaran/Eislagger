#!/bin/bash

# EisLager Development Setup Script
set -e

echo "🛠️ Setting up EisLager development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Install dependencies for all services
echo -e "${BLUE}📦 Installing dependencies...${NC}"

services=("AuthService" "SalesService" "InventoryService" "AdminService" "CommunicationsService" "AnalyticsService")

for service in "${services[@]}"; do
    echo -e "${BLUE}📦 Installing dependencies for $service...${NC}"
    cd services/$service
    npm install
    cd ../..
done

# Install frontend dependencies
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
cd frontend
npm install
cd ..

# Generate Prisma clients
echo -e "${BLUE}🔧 Generating Prisma clients...${NC}"
for service in "${services[@]}"; do
    echo -e "${BLUE}🔧 Generating Prisma client for $service...${NC}"
    cd services/$service
    npx prisma generate
    cd ../..
done

# Create environment files
echo -e "${BLUE}📝 Creating environment files...${NC}"

# Auth Service env
if [ ! -f services/AuthService/.env ]; then
    cat > services/AuthService/.env << EOF
PORT=3002
DATABASE_URL="postgresql://eislagger_user:eislagger_password@localhost:5432/eislagger_auth"
JWT_SECRET="development_jwt_secret_key_change_in_production"
REFRESH_SECRET="development_refresh_secret_key_change_in_production"
NODE_ENV="development"
EOF
    echo -e "${GREEN}✅ Created AuthService/.env${NC}"
fi

# Sales Service env
if [ ! -f services/SalesService/.env ]; then
    cat > services/SalesService/.env << EOF
PORT=3004
DATABASE_URL="postgresql://eislagger_user:eislagger_password@localhost:5432/eislagger_sales"
KAFKA_BROKERS="localhost:9092"
JWT_SECRET="development_jwt_secret_key_change_in_production"
NODE_ENV="development"
EOF
    echo -e "${GREEN}✅ Created SalesService/.env${NC}"
fi

# Inventory Service env
if [ ! -f services/InventoryService/.env ]; then
    cat > services/InventoryService/.env << EOF
PORT=3003
DATABASE_URL="postgresql://eislagger_user:eislagger_password@localhost:5432/eislagger_inventory"
KAFKA_BROKERS="localhost:9092"
JWT_SECRET="development_jwt_secret_key_change_in_production"
NODE_ENV="development"
EOF
    echo -e "${GREEN}✅ Created InventoryService/.env${NC}"
fi

# Admin Service env
if [ ! -f services/AdminService/.env ]; then
    cat > services/AdminService/.env << EOF
PORT=3001
DATABASE_URL="postgresql://eislagger_user:eislagger_password@localhost:5432/eislagger_admin"
KAFKA_BROKERS="localhost:9092"
JWT_SECRET="development_jwt_secret_key_change_in_production"
NODE_ENV="development"
EOF
    echo -e "${GREEN}✅ Created AdminService/.env${NC}"
fi

# Communications Service env
if [ ! -f services/CommunicationsService/.env ]; then
    cat > services/CommunicationsService/.env << EOF
PORT=3005
DATABASE_URL="postgresql://eislagger_user:eislagger_password@localhost:5432/eislagger_communications"
KAFKA_BROKERS="localhost:9092"
JWT_SECRET="development_jwt_secret_key_change_in_production"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
NODE_ENV="development"
EOF
    echo -e "${GREEN}✅ Created CommunicationsService/.env${NC}"
fi

# Analytics Service env
if [ ! -f services/AnalyticsService/.env ]; then
    cat > services/AnalyticsService/.env << EOF
PORT=3006
DATABASE_URL="postgresql://eislagger_user:eislagger_password@localhost:5432/eislagger_analytics"
KAFKA_BROKERS="localhost:9092"
JWT_SECRET="development_jwt_secret_key_change_in_production"
NODE_ENV="development"
EOF
    echo -e "${GREEN}✅ Created AnalyticsService/.env${NC}"
fi

echo -e "${GREEN}🎉 Development environment setup complete!${NC}"
echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "${YELLOW}   1. Start PostgreSQL database${NC}"
echo -e "${YELLOW}   2. Run 'npm run dev' in each service directory${NC}"
echo -e "${YELLOW}   3. Run 'npm run dev' in frontend directory${NC}"
echo -e "${YELLOW}   4. Or use 'docker-compose up' for full stack${NC}"

