FROM debian:bullseye-slim

# Install SQLite
RUN apt-get update && \
    apt-get install -y sqlite3 && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /data

# Define volume for persistent data
VOLUME /data

# Copy SQL initialization script
COPY init.sql /docker-entrypoint-initdb.d/

# Initialization command
CMD ["sh", "-c", "if [ ! -f /data/database.sqlite ]; then sqlite3 /data/database.sqlite < /docker-entrypoint-initdb.d/init.sql; fi && tail -f /dev/null"]
