FROM node:20-bullseye-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and lock file to optimize Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the frontend source code
COPY . .

# Build the Next.js frontend application
RUN npm run build

# Expose default Next.js port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
