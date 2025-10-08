#!/bin/bash

# EisLager Stop Script
# Simple script to stop all EisLager services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}🛑 Stopping EisLager Services${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to stop Docker services
stop_docker_services() {
    print_status "Stopping Docker services..."
    
    # Stop main compose
    if [ -f "docker-compose.yml" ]; then
        docker-compose down
        print_success "Stopped main Docker services"
    fi
    
    # Stop infrastructure compose
    if [ -f "docker-compose.infrastructure.yml" ]; then
        docker-compose -f docker-compose.infrastructure.yml down
        print_success "Stopped infrastructure Docker services"
    fi
}

# Function to stop manual services
stop_manual_services() {
    print_status "Stopping manual services..."
    
    # Kill npm processes
    if pgrep -f "npm run dev" > /dev/null; then
        pkill -f "npm run dev"
        print_success "Stopped npm development processes"
    else
        print_warning "No npm development processes found"
    fi
    
    # Kill ts-node processes
    if pgrep -f "ts-node" > /dev/null; then
        pkill -f "ts-node"
        print_success "Stopped ts-node processes"
    else
        print_warning "No ts-node processes found"
    fi
    
    # Kill next processes
    if pgrep -f "next dev" > /dev/null; then
        pkill -f "next dev"
        print_success "Stopped Next.js development processes"
    else
        print_warning "No Next.js development processes found"
    fi
    
    # Clean up PID file
    if [ -f ".service_pids" ]; then
        rm .service_pids
        print_success "Cleaned up PID file"
    fi
}

# Function to show running processes
show_running_processes() {
    print_status "Checking for running EisLager processes..."
    
    # Check for Docker containers
    if command -v docker >/dev/null 2>&1; then
        RUNNING_CONTAINERS=$(docker ps --filter "name=eislagger" --format "table {{.Names}}\t{{.Status}}" 2>/dev/null || true)
        if [ -n "$RUNNING_CONTAINERS" ]; then
            print_warning "Running Docker containers:"
            echo "$RUNNING_CONTAINERS"
        else
            print_success "No EisLager Docker containers running"
        fi
    fi
    
    # Check for Node.js processes
    NODE_PROCESSES=$(pgrep -f "eislagger\|AuthService\|SalesService\|InventoryService\|AdminService\|CommunicationsService\|AnalyticsService" 2>/dev/null || true)
    if [ -n "$NODE_PROCESSES" ]; then
        print_warning "Running Node.js processes:"
        ps -p $NODE_PROCESSES -o pid,ppid,cmd 2>/dev/null || true
    else
        print_success "No EisLager Node.js processes running"
    fi
}

# Main script logic
main() {
    print_header
    
    # Parse command line arguments
    case "${1:-all}" in
        "docker"|"d")
            stop_docker_services
            ;;
        "manual"|"m")
            stop_manual_services
            ;;
        "all"|"a")
            stop_docker_services
            stop_manual_services
            ;;
        "status"|"s")
            show_running_processes
            exit 0
            ;;
        "help"|"h"|"-h"|"--help")
            echo "Usage: $0 [OPTION]"
            echo ""
            echo "Options:"
            echo "  docker, d     Stop Docker services only"
            echo "  manual, m     Stop manual services only"
            echo "  all, a        Stop all services (default)"
            echo "  status, s     Show running processes"
            echo "  help, h       Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0            # Stop all services"
            echo "  $0 docker     # Stop Docker services only"
            echo "  $0 manual     # Stop manual services only"
            echo "  $0 status     # Show running processes"
            echo ""
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
    
    print_success "EisLager services stopped!"
    
    # Show final status
    echo ""
    print_status "Final status check:"
    show_running_processes
}

# Run main function
main "$@"