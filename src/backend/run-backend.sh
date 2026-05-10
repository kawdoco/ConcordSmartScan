#!/bin/bash

echo "===================================="
echo "Backend Setup and Run Script"
echo "===================================="

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "[ERROR] Maven is not installed!"
    echo "Please install Maven or use Maven Wrapper: ./mvnw"
    exit 1
fi

echo "[INFO] Maven found!"
echo "[INFO] Checking and downloading dependencies..."

# Download dependencies if not present
mvn dependency:resolve

echo "[INFO] Building application..."
mvn clean package -DskipTests

if [ $? -ne 0 ]; then
    echo "[ERROR] Build failed!"
    exit 1
fi

echo "[INFO] Starting backend server..."
echo "[INFO] Backend will run on http://localhost:8080"
echo "===================================="

# Run the application
mvn spring-boot:run
