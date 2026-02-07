#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="/Users/steph/perfumeRec"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Starting Aura Perfume Recommendation System${NC}"
echo -e "${BLUE}================================${NC}\n"

# Function to start backend
start_backend() {
    echo -e "${YELLOW}[1/4] Starting Backend Server...${NC}"
    cd "$PROJECT_ROOT/backend"
    node index.js > "$PROJECT_ROOT/logs/backend.log" 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > "$PROJECT_ROOT/logs/backend.pid"
    echo -e "${GREEN}✓ Backend started on port 8080 (PID: $BACKEND_PID)${NC}\n"
    sleep 2
}

# Function to start recommendation system
start_recsystem() {
    echo -e "${YELLOW}[2/4] Starting Recommendation System (Python Flask)...${NC}"
    cd "$PROJECT_ROOT/recSystem"
    source venv/bin/activate
    python app.py > "$PROJECT_ROOT/logs/recsystem.log" 2>&1 &
    RECSYSTEM_PID=$!
    echo $RECSYSTEM_PID > "$PROJECT_ROOT/logs/recsystem.pid"
    echo -e "${GREEN}✓ Recommendation System started on port 5000 (PID: $RECSYSTEM_PID)${NC}\n"
    sleep 2
}

# Function to start deep research service
start_deepresearch() {
    echo -e "${YELLOW}[3/4] Starting Deep Research Service (Python Flask)...${NC}"
    cd "$PROJECT_ROOT/deepResearch"

    # Create venv if it doesn't exist
    if [ ! -d "venv" ]; then
        echo -e "${YELLOW}    Creating virtual environment...${NC}"
        python3 -m venv venv
        ./venv/bin/pip install -r requirements.txt > /dev/null 2>&1
    fi

    # Check if .env exists
    if [ ! -f ".env" ]; then
        echo -e "${RED}    Warning: .env file not found. Copy .env.example to .env and add your API key${NC}"
    fi

    # Use venv python directly instead of source activate
    ./venv/bin/python server.py > "$PROJECT_ROOT/logs/deepresearch.log" 2>&1 &
    DEEPRESEARCH_PID=$!
    echo $DEEPRESEARCH_PID > "$PROJECT_ROOT/logs/deepresearch.pid"
    echo -e "${GREEN}✓ Deep Research started on port 5001 (PID: $DEEPRESEARCH_PID)${NC}\n"
    sleep 2
}

# Function to start frontend
start_frontend() {
    echo -e "${YELLOW}[4/4] Starting Frontend (React)...${NC}"
    cd "$PROJECT_ROOT/my-app"
    npm start > "$PROJECT_ROOT/logs/frontend.log" 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > "$PROJECT_ROOT/logs/frontend.pid"
    echo -e "${GREEN}✓ Frontend started on port 3000 (PID: $FRONTEND_PID)${NC}\n"
}

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_ROOT/logs"

# Start all services
start_backend
start_recsystem
start_deepresearch
start_frontend

echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}All services started successfully!${NC}"
echo -e "${BLUE}================================${NC}\n"

echo -e "${BLUE}Service URLs:${NC}"
echo -e "  Frontend:      ${GREEN}http://localhost:3000${NC}"
echo -e "  Backend:       ${GREEN}http://localhost:8080${NC}"
echo -e "  RecSystem:     ${GREEN}http://localhost:5000${NC}"
echo -e "  Deep Research: ${GREEN}http://localhost:5001${NC}\n"

echo -e "${BLUE}Logs:${NC}"
echo -e "  Backend:       $PROJECT_ROOT/logs/backend.log"
echo -e "  RecSystem:     $PROJECT_ROOT/logs/recsystem.log"
echo -e "  Deep Research: $PROJECT_ROOT/logs/deepresearch.log"
echo -e "  Frontend:      $PROJECT_ROOT/logs/frontend.log\n"

echo -e "${YELLOW}To stop all services, run:${NC} ./stop_all.sh"
echo -e "${YELLOW}To view logs, run:${NC} tail -f logs/*.log\n"

# Wait for user interrupt
echo -e "${BLUE}Press Ctrl+C to stop all services...${NC}"
trap "echo -e '\n${RED}Stopping all services...${NC}'; kill $BACKEND_PID $RECSYSTEM_PID $DEEPRESEARCH_PID $FRONTEND_PID 2>/dev/null; exit" INT

# Keep script running
wait
