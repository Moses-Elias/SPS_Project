# Use Node.js LTS version as base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package files first and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port your server runs on
EXPOSE 8080

# Command to run your app
CMD ["node", "server.js"]
