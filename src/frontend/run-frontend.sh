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

# Ensure map packages (and any declared QR packages) exist
REQUIRED_PACKAGES=(leaflet react-leaflet)
QR_PACKAGES=(qrcode.react react-qr-reader html5-qrcode jsqr qr-scanner)
OPTIONAL_QR_PACKAGES=()

for pkg in "${QR_PACKAGES[@]}"; do
    if grep -qi "\"$pkg\"" package.json; then
        OPTIONAL_QR_PACKAGES+=("$pkg")
    fi
done

CHECK_PACKAGES=("${REQUIRED_PACKAGES[@]}" "${OPTIONAL_QR_PACKAGES[@]}")

if npm ls "${CHECK_PACKAGES[@]}" --depth=0 >/dev/null 2>&1; then
    echo "[INFO] Map/QR packages already installed. Skipping install."
else
    echo "[INFO] Missing map/QR packages detected. Installing: ${CHECK_PACKAGES[*]}"
    npm install "${CHECK_PACKAGES[@]}" || { echo "[ERROR] Package install failed!"; exit 1; }
fi

echo "[INFO] Starting frontend development server..."
echo "[INFO] Frontend will run on http://localhost:3000"
echo "===================================="

# Run the application
npm start
