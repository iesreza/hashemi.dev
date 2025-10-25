# Multi-stage Dockerfile for Reza Hashemi Terminal Portfolio
# Stage 1: Build the frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the frontend with Vite
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS production

WORKDIR /app

# Install git for pulling static files
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy backend server
COPY server.js ./

# Copy data and seo directories (will be overridden by git pull if configured)
COPY data ./data
COPY seo ./seo

# Copy public assets
COPY public ./public

# Create entrypoint script that pulls static files before starting
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'set -e' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo '# Pull static files if GIT_REPO is set' >> /app/entrypoint.sh && \
    echo 'if [ ! -z "$GIT_REPO" ]; then' >> /app/entrypoint.sh && \
    echo '  echo "Pulling static files from $GIT_REPO..."' >> /app/entrypoint.sh && \
    echo '  ' >> /app/entrypoint.sh && \
    echo '  # Clone or pull the repository' >> /app/entrypoint.sh && \
    echo '  if [ ! -d "/tmp/static-files/.git" ]; then' >> /app/entrypoint.sh && \
    echo '    echo "Cloning repository..."' >> /app/entrypoint.sh && \
    echo '    git clone "$GIT_REPO" /tmp/static-files' >> /app/entrypoint.sh && \
    echo '  else' >> /app/entrypoint.sh && \
    echo '    echo "Pulling latest changes..."' >> /app/entrypoint.sh && \
    echo '    cd /tmp/static-files && git pull' >> /app/entrypoint.sh && \
    echo '  fi' >> /app/entrypoint.sh && \
    echo '  ' >> /app/entrypoint.sh && \
    echo '  # Copy data directory if it exists' >> /app/entrypoint.sh && \
    echo '  if [ -d "/tmp/static-files/data" ]; then' >> /app/entrypoint.sh && \
    echo '    echo "Copying data directory..."' >> /app/entrypoint.sh && \
    echo '    cp -r /tmp/static-files/data/* /app/data/' >> /app/entrypoint.sh && \
    echo '  fi' >> /app/entrypoint.sh && \
    echo '  ' >> /app/entrypoint.sh && \
    echo '  # Copy seo directory if it exists' >> /app/entrypoint.sh && \
    echo '  if [ -d "/tmp/static-files/seo" ]; then' >> /app/entrypoint.sh && \
    echo '    echo "Copying seo directory..."' >> /app/entrypoint.sh && \
    echo '    cp -r /tmp/static-files/seo/* /app/seo/' >> /app/entrypoint.sh && \
    echo '  fi' >> /app/entrypoint.sh && \
    echo '  ' >> /app/entrypoint.sh && \
    echo '  # Copy public assets if they exist' >> /app/entrypoint.sh && \
    echo '  if [ -d "/tmp/static-files/public" ]; then' >> /app/entrypoint.sh && \
    echo '    echo "Copying public assets..."' >> /app/entrypoint.sh && \
    echo '    cp -r /tmp/static-files/public/* /app/public/' >> /app/entrypoint.sh && \
    echo '  fi' >> /app/entrypoint.sh && \
    echo '  ' >> /app/entrypoint.sh && \
    echo '  echo "Static files updated successfully!"' >> /app/entrypoint.sh && \
    echo 'else' >> /app/entrypoint.sh && \
    echo '  echo "No GIT_REPO configured, using bundled static files"' >> /app/entrypoint.sh && \
    echo 'fi' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo '# Start the server' >> /app/entrypoint.sh && \
    echo 'echo "Starting server..."' >> /app/entrypoint.sh && \
    echo 'exec node server.js' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Expose port for backend server
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/visitor', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]
