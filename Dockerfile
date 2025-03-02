# Use Node.js official image as base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy project files
COPY . .

# Build Nuxt app
RUN npm run build

# Expose the port Nuxt will run on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
