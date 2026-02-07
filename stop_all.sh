#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="/Users/steph/perfumeRec"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Stopping Aura Services${NC}"
echo -e "${BLUE}================================${NC}\n"

# Function to stop a service
stop_service() {
    local service_name=$1
    local pid_file="$PROJECT_ROOT/logs/$service_name.pid"

    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${RED}Stopping $service_name (PID: $pid)...${NC}"
            kill $pid 2>/dev/null
            sleep 1

            # Force kill if still running
            if ps -p $pid > /dev/null 2>&1; then
                echo -e "${RED}Force stopping $service_name...${NC}"
                kill -9 $pid 2>/dev/null
            fi

            rm "$pid_file"
            echo -e "${GREEN}✓ $service_name stopped${NC}"
        else
            echo -e "${BLUE}$service_name was not running${NC}"
            rm "$pid_file"
        fi
    else
        echo -e "${BLUE}No PID file found for $service_name${NC}"
    fi
}

# Stop all services
stop_service "backend"
stop_service "recsystem"
stop_service "deepresearch"
stop_service "frontend"

# Also kill any remaining node/python processes on these ports
echo -e "\n${BLUE}Cleaning up any remaining processes...${NC}"

# Kill processes on port 8080 (backend)
BACKEND_PIDS=$(lsof -ti:8080 2>/dev/null)
if [ ! -z "$BACKEND_PIDS" ]; then
    echo -e "${RED}Stopping processes on port 8080...${NC}"
    kill -9 $BACKEND_PIDS 2>/dev/null
fi

# Kill processes on port 5000 (recsystem)
RECSYSTEM_PIDS=$(lsof -ti:5000 2>/dev/null)
if [ ! -z "$RECSYSTEM_PIDS" ]; then
    echo -e "${RED}Stopping processes on port 5000...${NC}"
    kill -9 $RECSYSTEM_PIDS 2>/dev/null
fi

# Kill processes on port 5001 (deepresearch)
DEEPRESEARCH_PIDS=$(lsof -ti:5001 2>/dev/null)
if [ ! -z "$DEEPRESEARCH_PIDS" ]; then
    echo -e "${RED}Stopping processes on port 5001...${NC}"
    kill -9 $DEEPRESEARCH_PIDS 2>/dev/null
fi

# Kill processes on port 3000 (frontend)
FRONTEND_PIDS=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$FRONTEND_PIDS" ]; then
    echo -e "${RED}Stopping processes on port 3000...${NC}"
    kill -9 $FRONTEND_PIDS 2>/dev/null
fi

echo -e "\n${GREEN}All services stopped successfully!${NC}\n"
