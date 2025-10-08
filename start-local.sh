#!/bin/bash

# EisLager Local Development Startup Script
# Simple script to run EisLager locally

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}🍦 EisLager Local Development${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v node >/dev/null 2>&1; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to check if Docker is available
check_docker() {
    if command -v docker >/dev/null 2>&1 && command -v docker-compose >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to start infrastructure with Docker
start_infrastructure() {
    print_status "Starting infrastructure services (PostgreSQL, Redis, Kafka)..."
    docker-compose -f docker-compose.infrastructure.yml up -d
    print_success "Infrastructure services started!"
}

# Function to start services manually
start_services() {
    print_status "Starting EisLager services manually..."
    
    # Create logs directory
    mkdir -p logs
    
    # Create a PID file to track processes
    PID_FILE=".service_pids"
    > $PID_FILE
    
    # Start services in background
    services=("AuthService:3002" "SalesService:3004" "InventoryService:3003" "AdminService:3001" "CommunicationsService:3005" "AnalyticsService:3006")
    
    for service_info in "${services[@]}"; do
        service_name=$(echo $service_info | cut -d':' -f1)
        service_port=$(echo $service_info | cut -d':' -f2)
        
        if [ -d "services/$service_name" ]; then
            print_status "Starting $service_name on port $service_port..."
            cd services/$service_name
            npm run dev > ../logs/$service_name.log 2>&1 &
            SERVICE_PID=$!
            echo $SERVICE_PID >> ../../$PID_FILE
            cd ../..
            print_success "$service_name started (PID: $SERVICE_PID)"
        else
            print_warning "Service directory services/$service_name not found"
        fi
    done
    
    # Start frontend
    if [ -d "frontend" ]; then
        print_status "Starting Frontend on port 3000..."
        cd frontend
        npm run dev > ../logs/frontend.log 2>&1 &
        FRONTEND_PID=$!
        echo $FRONTEND_PID >> ../$PID_FILE
        cd ..
        print_success "Frontend started (PID: $FRONTEND_PID)"
    else
        print_warning "Frontend directory not found"
    fi
    
    print_success "All services started manually!"
}

# Function to show service URLs
show_service_urls() {
    echo ""
    print_header
    echo -e "${BLUE}🌐 Service URLs:${NC}"
    echo -e "${GREEN}🎨 Frontend:${NC}        http://localhost:3000"
    echo -e "${GREEN}🔐 Auth Service:${NC}    http://localhost:3002"
    echo -e "${GREEN}💰 Sales Service:${NC}   http://localhost:3004"
    echo -e "${GREEN}📦 Inventory Service:${NC} http://localhost:3003"
    echo -e "${GREEN}⚙️ Admin Service:${NC}   http://localhost:3001"
    echo -e "${GREEN}💬 Communications Service:${NC} http://localhost:3005"
    echo -e "${GREEN}📊 Analytics Service:${NC} http://localhost:3006"
    echo ""
    echo -e "${BLUE}🔍 Health Check URLs:${NC}"
    echo -e "curl http://localhost:3002/"
    echo -e "curl http://localhost:3004/"
    echo -e "curl http://localhost:3003/"
    echo -e "curl http://localhost:3001/"
    echo -e "curl http://localhost:3005/"
    echo -e "curl http://localhost:3006/"
    echo ""
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  docker, d     Start with Docker Compose (recommended)"
    echo "  manual, m     Start services manually with infrastructure"
    echo "  infra, i      Start only infrastructure services"
    echo "  help, h       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 docker     # Start everything with Docker Compose"
    echo "  $0 manual     # Start infrastructure + services manually"
    echo "  $0 infra      # Start only infrastructure services"
    echo ""
}

# Main script logic
main() {
    print_header
    
    # Parse command line arguments
    case "${1:-manual}" in
        "docker"|"d")
            check_prerequisites
            if check_docker; then
                print_status "Starting EisLager with Docker Compose..."
                docker-compose up -d
                print_success "EisLager started with Docker Compose!"
                show_service_urls
            else
                print_error "Docker and Docker Compose are not installed."
                print_status "Falling back to manual startup..."
                start_infrastructure
                sleep 5
                start_services
                show_service_urls
            fi
            ;;
        "manual"|"m")
            check_prerequisites
            if check_docker; then
                start_infrastructure
                sleep 5
            else
                print_warning "Docker not available. Make sure PostgreSQL, Redis, and Kafka are running locally."
            fi
            start_services
            show_service_urls
            ;;
        "infra"|"i")
            if check_docker; then
                start_infrastructure
                print_success "Infrastructure services started!"
                print_status "Run '$0 manual' to start the application services"
            else
                print_error "Docker and Docker Compose are not installed."
                exit 1
            fi
            ;;
        "help"|"h"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"