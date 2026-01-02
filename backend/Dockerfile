FROM node:18-alpine

# Install netcat for database health checks
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies including devDependencies for development
RUN npm install --include=dev

COPY . .

# Copy and set up entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Build TypeScript
RUN npm run build

EXPOSE 3001

# Use entrypoint to handle database initialization
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Default command (can be overridden by docker-compose)
CMD ["npm", "run", "dev"]
