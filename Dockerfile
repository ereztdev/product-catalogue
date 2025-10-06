# Production Dockerfile - Minimal Ubuntu-based setup
FROM node:18-bullseye-slim

# Install only essential runtime dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm ci --only=production --silent
RUN cd backend && npm ci --only=production --silent
RUN cd frontend && npm ci --silent

# Copy source code
COPY . .

# Build frontend
RUN cd frontend && npm run build

# Create data directory with proper ownership and permissions
RUN mkdir -p /app/data && chown -R appuser:appuser /app/data && chmod 755 /app/data

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/app/products.db

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["node", "backend/server.js"]