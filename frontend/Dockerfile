FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

EXPOSE 3000

# react-scripts handles TypeScript compilation automatically
CMD ["npm", "start"]
