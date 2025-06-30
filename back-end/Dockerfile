# Use Debian-based Node.js image
FROM node:current-bullseye

# Install SQLite
RUN apt-get update && \
    apt-get install -y sqlite3 && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json first (to leverage Docker layer caching)
COPY package.json ./

# Create necessary directories
RUN mkdir -p /app/avatars /app/src

# Install global and local npm packages
RUN npm install -g nodemon && npm install

# Copy source code
COPY src/ ./src/

# Set environment variables
ENV SQLITE_DB_PATH=/data/database.sqlite

# Expose port
EXPOSE 8181

# Default command
ENTRYPOINT ["npm", "run", "dev"]