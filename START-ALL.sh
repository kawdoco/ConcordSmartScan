#!/bin/bash

echo "===================================="
echo "Starting Full Application"
echo "===================================="
echo "This will start both Backend and Frontend"
echo "===================================="

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start backend in background
echo "[INFO] Starting Backend..."
cd "$SCRIPT_DIR/src/backend"
./run-backend.sh &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 5

# Start frontend in background
echo "[INFO] Starting Frontend..."
cd "$SCRIPT_DIR/src/frontend"
./run-frontend.sh &
FRONTEND_PID=$!

echo "===================================="
echo "Backend and Frontend are starting..."
echo "Backend: http://localhost:8080 (PID: $BACKEND_PID)"
echo "Frontend: http://localhost:3000 (PID: $FRONTEND_PID)"
echo "===================================="
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
