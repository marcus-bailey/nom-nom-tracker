# Multi-stage build for production
# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set environment variables for the build
# PUBLIC_URL: Sets the base path for all assets (js, css, images)
# REACT_APP_API_URL: Sets the base URL for API calls (api.ts appends /api/... to this)
ENV PUBLIC_URL=/nom-nom
ENV REACT_APP_API_URL=/nom-nom

# Build the application
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine AS production

# Install wget for healthchecks
RUN apk add --no-cache wget

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 3000 (matching what docker-compose expects)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
