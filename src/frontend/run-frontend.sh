#!/bin/bash

echo "===================================="
echo "Frontend Setup and Run Script"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo "[INFO] Node.js found!"
node --version

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed!"
    exit 1
fi

echo "[INFO] npm found!"
npm --version

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[INFO] node_modules not found. Installing dependencies..."
    npm install
else
    echo "[INFO] node_modules found. Checking for updates..."
    npm install
fi

if [ $? -ne 0 ]; then
    echo "[ERROR] npm install failed!"
    exit 1
fi

echo "[INFO] Starting frontend development server..."
echo "[INFO] Frontend will run on http://localhost:3000"
echo "===================================="

# Run the application
npm start
