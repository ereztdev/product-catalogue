#!/bin/bash

# Smart Docker startup script
echo "🐳 Product Catalog - Smart Docker Startup"

# Function to find and kill processes on port 3000
cleanup_port() {
    echo "🔍 Checking for processes on port 3000..."
    PIDS=$(lsof -ti:3000 2>/dev/null)
    if [ ! -z "$PIDS" ]; then
        echo "⚠️  Found processes on port 3000: $PIDS"
        echo "🛑 Killing processes..."
        kill -9 $PIDS 2>/dev/null
        sleep 2
        echo "✅ Port 3000 cleaned up"
    else
        echo "✅ Port 3000 is free"
    fi
}

# Function to clean up Docker containers
cleanup_docker() {
    echo "🧹 Cleaning up Docker containers..."
    docker compose down 2>/dev/null || true
    docker stop $(docker ps -q --filter "name=product-catalogue") 2>/dev/null || true
    docker rm $(docker ps -aq --filter "name=product-catalogue") 2>/dev/null || true
    echo "✅ Docker cleanup complete"
}

# Function to start with retry logic
start_with_retry() {
    echo "🚀 Starting Product Catalog..."
    local max_attempts=3
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo "📦 Attempt $attempt/$max_attempts"
        
        if docker compose up --build; then
            echo "✅ Product Catalog started successfully!"
            return 0
        else
            echo "❌ Attempt $attempt failed"
            cleanup_port
            cleanup_docker
            sleep 3
            ((attempt++))
        fi
    done
    
    echo "💥 Failed to start after $max_attempts attempts"
    return 1
}

# Main execution
echo "=========================================="
echo "🏦 Product Catalog - Smart Startup"
echo "=========================================="

cleanup_port
cleanup_docker
start_with_retry
