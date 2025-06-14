#!/bin/bash
set -euo pipefail

CONTAINER_NAME=ts-rag-server

echo "🔨 Building Docker image (with --load)..."
docker build --load -t $CONTAINER_NAME .

echo "✅ Build complete. Image loaded into local Docker."

# Ensure previous container is stopped
if docker ps -q --filter "name=$CONTAINER_NAME" | grep -q .; then
  echo "🛑 Stopping existing container..."
  docker stop $CONTAINER_NAME || true
fi

# Remove existing container if it exists (running or stopped)
if docker container inspect ts-rag-server >/dev/null 2>&1; then
  echo "🧹 Removing existing container named ts-rag-server..."
  docker rm -f ts-rag-server || true
fi

echo "🚀 Starting container '$CONTAINER_NAME' on port 3000..."
docker run -d --rm \
  --name $CONTAINER_NAME \
  --env-file .env \
  -p 3000:3000 \
  $CONTAINER_NAME

# Trap CTRL+C or exit to stop container
trap "echo '🧹 Cleaning up...'; docker stop $CONTAINER_NAME" EXIT

# Follow logs until manually exited
echo "📋 Attaching logs (press Ctrl+C to stop)..."
docker logs -f $CONTAINER_NAME

