# Use Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY src/ ./src/
COPY tsconfig.json ./

# Build the app
RUN npm run build

# Expose port
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
