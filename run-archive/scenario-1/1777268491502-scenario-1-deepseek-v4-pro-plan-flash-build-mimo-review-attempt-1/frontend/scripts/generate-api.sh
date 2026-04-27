#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "Starting backend..."
cd ../backend
dotnet run --project src/RestaurantBooking --urls "http://localhost:5000" &
BACKEND_PID=$!

# Wait for backend to be ready
for i in $(seq 1 30); do
  if curl -s http://localhost:5000/openapi/v1.json > /dev/null 2>&1; then
    echo "Backend ready"
    break
  fi
  sleep 1
done

echo "Fetching OpenAPI spec..."
curl -s http://localhost:5000/openapi/v1.json > openapi.json

echo "Generating API client..."
npx orval --config orval.config.ts

echo "Cleaning up..."
kill $BACKEND_PID 2>/dev/null || true
wait $BACKEND_PID 2>/dev/null || true

echo "Done"
