FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies including devDependencies for development
RUN npm install --include=dev

COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3001

# Use built files for production, dev mode for development
CMD ["npm", "run", "dev"]
