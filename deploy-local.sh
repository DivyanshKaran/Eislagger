#!/bin/bash

#!/bin/bash
# EisLager Local Deployment Script
# Comprehensive script for local development with Docker and manual options
# Version: 2.0.0
# Author: EisLager Development Team

set -e

# Trap signals for graceful shutdown
trap 'echo -e "\n${YELLOW}[INFO]${NC} Received interrupt signal. Cleaning up..."; cleanup; exit 130' INT TERM

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="EisLager"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$PROJECT_DIR/logs"
PID_FILE="$PROJECT_DIR/.service_pids"
ENV_FILE="$PROJECT_DIR/.env.local"

# Service configurations
declare -A SERVICES=(
    ["AdminService"]="3001"
    ["AuthService"]="3002"
    ["InventoryService"]="3003"
    ["SalesService"]="3004"
    ["CommunicationsService"]="3005"
    ["AnalyticsService"]="3006"
)

# Infrastructure services
declare -A INFRA_SERVICES=(
    ["postgres"]="5432"
    ["redis"]="6379"
    ["kafka"]="9092"
)

# Print functions
print_header() {
    echo -e "${PURPLE}${BOLD}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🍦 EisLager Local Deploy                 ║"
    echo "║                   Ice Cream Management System               ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

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

print_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_step "Checking prerequisites..."
    
    local missing_deps=()
    
    # Check Node.js
    if ! command_exists node; then
        missing_deps+=("Node.js 18+")
    else
        local node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$node_version" -lt 18 ]; then
            print_error "Node.js version 18+ is required. Current version: $(node -v)"
            exit 1
        fi
    fi
    
    # Check npm
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi
    
    # Check Docker (optional)
    if ! command_exists docker; then
        print_warning "Docker not found. Docker mode will be unavailable."
    fi
    
    if ! command_exists docker-compose; then
        print_warning "Docker Compose not found. Docker mode will be unavailable."
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        print_error "Missing required dependencies: ${missing_deps[*]}"
        print_status "Please install the missing dependencies and try again."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Create necessary directories and files
setup_environment() {
    print_step "Setting up environment..."
    
    # Create logs directory
    mkdir -p "$LOG_DIR"
    
    # Create .env.local if it doesn't exist
    if [ ! -f "$ENV_FILE" ]; then
        cat > "$ENV_FILE" << EOF
# EisLager Local Development Environment
NODE_ENV=development

# Database
DATABASE_URL=postgresql://eislagger_user:eislagger_password_2024@localhost:5432/eislagger_main

# Redis
REDIS_URL=redis://localhost:6379

# Kafka
KAFKA_BROKERS=localhost:9092

# JWT Secrets
JWT_SECRET=eislagger_jwt_secret_key_2024_change_in_production
REFRESH_SECRET=eislagger_refresh_secret_key_2024_change_in_production

# Service URLs
AUTH_SERVICE_URL=http://localhost:3002
SALES_SERVICE_URL=http://localhost:3004
INVENTORY_SERVICE_URL=http://localhost:3003
ADMIN_SERVICE_URL=http://localhost:3001
COMMUNICATIONS_SERVICE_URL=http://localhost:3005
ANALYTICS_SERVICE_URL=http://localhost:3006

# Frontend URLs
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_SALES_SERVICE_URL=http://localhost:3004
NEXT_PUBLIC_INVENTORY_SERVICE_URL=http://localhost:3003
NEXT_PUBLIC_ADMIN_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_COMMUNICATIONS_SERVICE_URL=http://localhost:3005
NEXT_PUBLIC_ANALYTICS_SERVICE_URL=http://localhost:3006
EOF
        print_success "Created .env.local file"
    fi
    
    # Clear PID file
    > "$PID_FILE"
    
    print_success "Environment setup complete"
}

# Check if port is available
check_port() {
    local port=$1
    if netstat -tuln | grep -q ":$port "; then
        return 0  # Port is in use (service is running)
    else
        return 1  # Port is available (service is not running)
    fi
}

# Wait for service to be ready
wait_for_service() {
    local service_name=$1
    local port=$2
    local max_attempts=60
    local attempt=1
    
    print_status "Waiting for $service_name to be ready on port $port..."
    
    while [ $attempt -le $max_attempts ]; do
        if ! check_port $port; then
            printf "."
            sleep 2
            attempt=$((attempt + 1))
        else
            echo ""
            print_success "$service_name is ready!"
            return 0
        fi
    done
    
    echo ""
    print_error "$service_name failed to start within expected time (${max_attempts}s)"
    return 1
}

# Start infrastructure with Docker
start_infrastructure_docker() {
    print_step "Starting infrastructure services with Docker..."
    
    if [ ! -f "docker-compose.infrastructure.yml" ]; then
        print_error "docker-compose.infrastructure.yml not found"
        return 1
    fi
    
    # Check for port conflicts
    local port_conflicts=()
    for service in "${!INFRA_SERVICES[@]}"; do
        local port="${INFRA_SERVICES[$service]}"
        if check_port $port; then
            port_conflicts+=("$service:$port")
        fi
    done
    
    if [ ${#port_conflicts[@]} -gt 0 ]; then
        print_warning "Port conflicts detected:"
        for conflict in "${port_conflicts[@]}"; do
            echo "  - $conflict"
        done
        print_status "Attempting to stop conflicting services..."
        
        # Try to stop conflicting PostgreSQL service
        if [[ " ${port_conflicts[*]} " =~ " postgres:5432 " ]]; then
            print_status "Stopping local PostgreSQL service..."
            sudo systemctl stop postgresql 2>/dev/null || true
            sudo service postgresql stop 2>/dev/null || true
        fi
        
        # Wait a moment for ports to be released
        sleep 3
    fi
    
    # Start infrastructure services
    docker-compose -f docker-compose.infrastructure.yml up -d
    
    # Wait for services to be ready
    for service in "${!INFRA_SERVICES[@]}"; do
        local port="${INFRA_SERVICES[$service]}"
        wait_for_service "$service" "$port"
    done
    
    print_success "Infrastructure services started with Docker!"
}

# Start infrastructure manually (requires local installation)
start_infrastructure_manual() {
    print_step "Starting infrastructure services manually..."
    
    local missing_services=()
    
    # Check if services are running
    for service in "${!INFRA_SERVICES[@]}"; do
        local port="${INFRA_SERVICES[$service]}"
        if ! check_port $port; then
            missing_services+=("$service:$port")
        fi
    done
    
    if [ ${#missing_services[@]} -gt 0 ]; then
        print_warning "The following services need to be started manually:"
        for service_info in "${missing_services[@]}"; do
            echo "  - $service_info"
        done
        print_status "Please start these services and run the script again."
        return 1
    fi
    
    print_success "All infrastructure services are running!"
}

# Install dependencies for a service
install_service_dependencies() {
    local service_name=$1
    local service_dir="$PROJECT_DIR/services/$service_name"
    
    if [ ! -d "$service_dir" ]; then
        print_warning "Service directory not found: $service_dir"
        return 1
    fi
    
    print_status "Installing dependencies for $service_name..."
    cd "$service_dir"
    
    if [ -f "package.json" ]; then
        npm install --silent
        print_success "Dependencies installed for $service_name"
    else
        print_warning "No package.json found in $service_name"
    fi
    
    cd "$PROJECT_DIR"
}

# Start a single service
start_service() {
    local service_name=$1
    local service_port=$2
    local service_dir="$PROJECT_DIR/services/$service_name"
    
    if [ ! -d "$service_dir" ]; then
        print_warning "Service directory not found: $service_dir"
        return 1
    fi
    
    # Check if port is available
    if check_port $service_port; then
        print_warning "Port $service_port is already in use. Skipping $service_name"
        return 1
    fi
    
    print_status "Starting $service_name on port $service_port..."
    
    cd "$service_dir"
    
    # Start service in background
    npm run dev > "$LOG_DIR/$service_name.log" 2>&1 &
    local service_pid=$!
    
    # Save PID
    echo "$service_pid:$service_name:$service_port" >> "$PID_FILE"
    
    cd "$PROJECT_DIR"
    
    # Wait for service to be ready
    wait_for_service "$service_name" "$service_port"
    
    print_success "$service_name started (PID: $service_pid)"
}

# Start all backend services
start_backend_services() {
    print_step "Starting backend services..."
    
    # Install dependencies for all services
    for service_name in "${!SERVICES[@]}"; do
        install_service_dependencies "$service_name"
    done
    
    # Start services
    for service_name in "${!SERVICES[@]}"; do
        local service_port="${SERVICES[$service_name]}"
        start_service "$service_name" "$service_port"
    done
    
    print_success "All backend services started!"
}

# Start frontend
start_frontend() {
    print_step "Starting frontend..."
    
    local frontend_dir="$PROJECT_DIR/frontend"
    
    if [ ! -d "$frontend_dir" ]; then
        print_error "Frontend directory not found: $frontend_dir"
        return 1
    fi
    
    # Check if port 3000 is available
    if check_port 3000; then
        print_warning "Port 3000 is already in use. Skipping frontend"
        return 1
    fi
    
    print_status "Installing frontend dependencies..."
    cd "$frontend_dir"
    npm install --silent
    
    print_status "Starting frontend on port 3000..."
    npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
    local frontend_pid=$!
    
    # Save PID
    echo "$frontend_pid:frontend:3000" >> "$PID_FILE"
    
    cd "$PROJECT_DIR"
    
    # Wait for frontend to be ready
    wait_for_service "frontend" 3000
    
    print_success "Frontend started (PID: $frontend_pid)"
}

# Start everything with Docker
start_docker() {
    print_step "Starting EisLager with Docker Compose..."
    
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found"
        return 1
    fi
    
    # Build and start all services
    docker-compose up -d --build
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check service health
    local services_ready=0
    local total_services=7  # 6 backend + 1 frontend
    
    for service_name in "${!SERVICES[@]}"; do
        local service_port="${SERVICES[$service_name]}"
        if check_port $service_port; then
            services_ready=$((services_ready + 1))
        fi
    done
    
    if check_port 3000; then
        services_ready=$((services_ready + 1))
    fi
    
    if [ $services_ready -eq $total_services ]; then
        print_success "All services started with Docker!"
    else
        print_warning "Some services may not be ready yet. Check logs with: docker-compose logs"
    fi
}

# Stop all services
stop_services() {
    print_step "Stopping all services..."
    
    # Stop Docker services if running
    if [ -f "docker-compose.yml" ] && docker-compose ps -q | grep -q .; then
        print_status "Stopping Docker services..."
        docker-compose down
    fi
    
    # Stop infrastructure services
    if [ -f "docker-compose.infrastructure.yml" ] && docker-compose -f docker-compose.infrastructure.yml ps -q | grep -q .; then
        print_status "Stopping infrastructure services..."
        docker-compose -f docker-compose.infrastructure.yml down
    fi
    
    # Stop manually started services
    if [ -f "$PID_FILE" ]; then
        print_status "Stopping manually started services..."
        while IFS=':' read -r pid service_name port; do
            if kill -0 "$pid" 2>/dev/null; then
                print_status "Stopping $service_name (PID: $pid)..."
                kill "$pid"
                print_success "$service_name stopped"
            fi
        done < "$PID_FILE"
        rm -f "$PID_FILE"
    fi
    
    print_success "All services stopped!"
}

# Show service status
show_status() {
    print_step "Service Status"
    echo ""
    
    # Check infrastructure services
    echo -e "${CYAN}Infrastructure Services:${NC}"
    for service in "${!INFRA_SERVICES[@]}"; do
        local port="${INFRA_SERVICES[$service]}"
        if check_port $port; then
            echo -e "  ${GREEN}✓${NC} $service (port $port) - ${GREEN}Running${NC}"
        else
            echo -e "  ${RED}✗${NC} $service (port $port) - ${RED}Not Running${NC}"
        fi
    done
    
    echo ""
    
    # Check backend services
    echo -e "${CYAN}Backend Services:${NC}"
    for service_name in "${!SERVICES[@]}"; do
        local service_port="${SERVICES[$service_name]}"
        if check_port $service_port; then
            echo -e "  ${GREEN}✓${NC} $service_name (port $service_port) - ${GREEN}Running${NC}"
        else
            echo -e "  ${RED}✗${NC} $service_name (port $service_port) - ${RED}Not Running${NC}"
        fi
    done
    
    echo ""
    
    # Check frontend
    echo -e "${CYAN}Frontend:${NC}"
    if check_port 3000; then
        echo -e "  ${GREEN}✓${NC} Frontend (port 3000) - ${GREEN}Running${NC}"
    else
        echo -e "  ${RED}✗${NC} Frontend (port 3000) - ${RED}Not Running${NC}"
    fi
    
    echo ""
}

# Show service URLs
show_urls() {
    print_step "Service URLs"
    echo ""
    echo -e "${GREEN}🌐 Frontend:${NC}        http://localhost:3000"
    echo -e "${GREEN}🔐 Auth Service:${NC}    http://localhost:3002"
    echo -e "${GREEN}💰 Sales Service:${NC}   http://localhost:3004"
    echo -e "${GREEN}📦 Inventory Service:${NC} http://localhost:3003"
    echo -e "${GREEN}⚙️ Admin Service:${NC}   http://localhost:3001"
    echo -e "${GREEN}💬 Communications Service:${NC} http://localhost:3005"
    echo -e "${GREEN}📊 Analytics Service:${NC} http://localhost:3006"
    echo ""
    echo -e "${CYAN}🔍 Health Check Commands:${NC}"
    echo "curl http://localhost:3002/health"
    echo "curl http://localhost:3004/health"
    echo "curl http://localhost:3003/health"
    echo "curl http://localhost:3001/health"
    echo "curl http://localhost:3005/health"
    echo "curl http://localhost:3006/health"
    echo ""
    echo -e "${PURPLE}💡 Quick Access:${NC}"
    echo "• Frontend Dashboard: http://localhost:3000"
    echo "• API Documentation: http://localhost:3001/docs"
    echo "• Service Status: $0 status"
    echo "• View Logs: $0 logs [service-name]"
    echo ""
}

# Show logs
show_logs() {
    local service_name=${1:-"all"}
    
    if [ "$service_name" = "all" ]; then
        print_step "All Service Logs"
        echo ""
        for log_file in "$LOG_DIR"/*.log; do
            if [ -f "$log_file" ]; then
                local service=$(basename "$log_file" .log)
                echo -e "${CYAN}=== $service ===${NC}"
                tail -n 20 "$log_file"
                echo ""
            fi
        done
    else
        local log_file="$LOG_DIR/$service_name.log"
        if [ -f "$log_file" ]; then
            print_step "$service_name Logs"
            tail -f "$log_file"
        else
            print_error "No logs found for $service_name"
        fi
    fi
}

# Clean up
cleanup() {
    print_step "Cleaning up..."
    
    # Stop services
    stop_services
    
    # Clean up logs (optional)
    if [ -d "$LOG_DIR" ]; then
        print_status "Logs are available in: $LOG_DIR"
        print_status "To clean logs, run: rm -rf $LOG_DIR/*"
    fi
    
    print_success "Cleanup complete!"
}

# Show help
show_help() {
    echo -e "${PURPLE}${BOLD}EisLager Local Deployment Script${NC}"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo -e "${CYAN}Commands:${NC}"
    echo "  start [mode]     Start EisLager (docker|manual|infra)"
    echo "  stop             Stop all services"
    echo "  restart [mode]   Restart EisLager"
    echo "  status           Show service status"
    echo "  logs [service]   Show logs (service name or 'all')"
    echo "  urls             Show service URLs"
    echo "  cleanup          Stop services and clean up"
    echo "  help             Show this help message"
    echo ""
    echo -e "${CYAN}Modes:${NC}"
    echo "  docker           Start with Docker Compose (recommended)"
    echo "  manual           Start infrastructure + services manually"
    echo "  infra            Start only infrastructure services"
    echo ""
    echo -e "${CYAN}Examples:${NC}"
    echo "  $0 start docker     # Start with Docker Compose"
    echo "  $0 start manual     # Start manually"
    echo "  $0 logs frontend    # Show frontend logs"
    echo "  $0 status           # Check service status"
    echo ""
    echo -e "${YELLOW}Tips:${NC}"
    echo "• Use Ctrl+C to gracefully stop all services"
    echo "• Logs are stored in: $LOG_DIR"
    echo "• Check service health with: $0 status"
    echo "• For troubleshooting, run: $0 logs [service-name]"
    echo ""
}

# Main function
main() {
    print_header
    
    case "${1:-help}" in
        "start")
            check_prerequisites
            setup_environment
            
            case "${2:-manual}" in
                "docker"|"d")
                    if command_exists docker && command_exists docker-compose; then
                        start_docker
                    else
                        print_error "Docker and Docker Compose are required for docker mode"
                        exit 1
                    fi
                    ;;
                "manual"|"m")
                    if command_exists docker && command_exists docker-compose; then
                        start_infrastructure_docker
                    else
                        start_infrastructure_manual
                    fi
                    start_backend_services
                    start_frontend
                    ;;
                "infra"|"i")
                    if command_exists docker && command_exists docker-compose; then
                        start_infrastructure_docker
                    else
                        start_infrastructure_manual
                    fi
                    ;;
                *)
                    print_error "Unknown start mode: $2"
                    show_help
                    exit 1
                    ;;
            esac
            
            show_status
            show_urls
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            stop_services
            sleep 2
            main start "${2:-manual}"
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs "$2"
            ;;
        "urls")
            show_urls
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
