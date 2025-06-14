# Use a Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy rest of the project
COPY . .

# Build TypeScript
RUN pnpm build

# Expose port (matches src/index.ts port)
EXPOSE 3000

# Start the app
CMD ["node", "dist/index.js"]

