FROM node:current-bullseye

# Install dependencies
RUN apt-get update && \
    apt-get install -y nginx openssl vim zsh curl && \
    rm -rf /var/lib/apt/lists/*

# Create required directories
RUN mkdir -p /var/lib/nginx/transcendence/dist \
    && mkdir -p /etc/nginx/ssl

# Copy frontend files
COPY front-end/tsconfig.json /var/lib/nginx/transcendence/tsconfig.json
COPY front-end/src /var/lib/nginx/transcendence/src
COPY front-end/index.html /var/lib/nginx/transcendence/index.html
COPY front-end/assets/ /var/lib/nginx/transcendence/dist/assets/

# Copy custom nginx config
COPY front-end/nginx.conf /etc/nginx/nginx.conf

# Generate self-signed SSL certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -out /etc/nginx/ssl/transcendence.crt \
    -keyout /etc/nginx/ssl/transcendence.key \
    -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/CN=localhost"

# Set working directory for build
WORKDIR /var/lib/nginx/transcendence

# Install TypeScript globally and compile
RUN npm install -g typescript && \
    npx tsc

# Install TailwindCSS and compile
RUN npm install tailwindcss @tailwindcss/cli && \
    npx tailwindcss -i ./src/input.css -o ./dist/output.css

# Expose HTTP and HTTPS ports (optional)
EXPOSE 80 443

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
