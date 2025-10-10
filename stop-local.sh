#!/bin/bash
# EisLager Local Stop Script
# Quick script to stop all EisLager services
# Version: 1.0.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$PROJECT_DIR/.service_pids"

# Print functions
print_header() {
    echo -e "${PURPLE}${BOLD}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🛑 EisLager Stop                        ║"
    echo "║                   Stopping All Services                     ║"
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

# Stop all services
stop_services() {
    print_status "Stopping all EisLager services..."
    
    # Stop Docker services if running
    if [ -f "docker-compose.yml" ] && docker-compose ps -q | grep -q .; then
        print_status "Stopping Docker services..."
        docker-compose down
        print_success "Docker services stopped"
    fi
    
    # Stop infrastructure services
    if [ -f "docker-compose.infrastructure.yml" ] && docker-compose -f docker-compose.infrastructure.yml ps -q | grep -q .; then
        print_status "Stopping infrastructure services..."
        docker-compose -f docker-compose.infrastructure.yml down
        print_success "Infrastructure services stopped"
    fi
    
    # Stop manually started services
    if [ -f "$PID_FILE" ]; then
        print_status "Stopping manually started services..."
        local stopped_count=0
        while IFS=':' read -r pid service_name port; do
            if kill -0 "$pid" 2>/dev/null; then
                print_status "Stopping $service_name (PID: $pid)..."
                kill "$pid"
                stopped_count=$((stopped_count + 1))
            fi
        done < "$PID_FILE"
        
        if [ $stopped_count -gt 0 ]; then
            print_success "$stopped_count service(s) stopped"
        else
            print_status "No running services found"
        fi
        
        rm -f "$PID_FILE"
    else
        print_status "No PID file found - no manually started services to stop"
    fi
    
    print_success "All services stopped!"
}

# Show help
show_help() {
    echo -e "${PURPLE}${BOLD}EisLager Stop Script${NC}"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo -e "${CYAN}Options:${NC}"
    echo "  -h, --help       Show this help message"
    echo "  -f, --force      Force stop all services (kill -9)"
    echo ""
    echo -e "${CYAN}Examples:${NC}"
    echo "  $0               # Stop all services gracefully"
    echo "  $0 --force       # Force stop all services"
    echo ""
}

# Force stop all services
force_stop_services() {
    print_warning "Force stopping all services..."
    
    # Force stop Docker services
    if [ -f "docker-compose.yml" ] && docker-compose ps -q | grep -q .; then
        print_status "Force stopping Docker services..."
        docker-compose kill
        docker-compose down
    fi
    
    # Force stop infrastructure services
    if [ -f "docker-compose.infrastructure.yml" ] && docker-compose -f docker-compose.infrastructure.yml ps -q | grep -q .; then
        print_status "Force stopping infrastructure services..."
        docker-compose -f docker-compose.infrastructure.yml kill
        docker-compose -f docker-compose.infrastructure.yml down
    fi
    
    # Force stop manually started services
    if [ -f "$PID_FILE" ]; then
        print_status "Force stopping manually started services..."
        while IFS=':' read -r pid service_name port; do
            if kill -0 "$pid" 2>/dev/null; then
                print_status "Force stopping $service_name (PID: $pid)..."
                kill -9 "$pid" 2>/dev/null || true
            fi
        done < "$PID_FILE"
        rm -f "$PID_FILE"
    fi
    
    print_success "All services force stopped!"
}

# Main function
main() {
    print_header
    
    case "${1:-}" in
        "-h"|"--help")
            show_help
            ;;
        "-f"|"--force")
            force_stop_services
            ;;
        "")
            stop_services
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