# Use the official Node.js 18 image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy only package files first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose port 8080 to match Cloud Run requirements
EXPOSE 8080

# Start the application
CMD ["node", "server.js"]
