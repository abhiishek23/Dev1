# Use the Node.js 16 Alpine image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app


# Copy only the package.json and package-lock.json files and install dependencies.
# This allows Docker to cache this layer when package files don't change.
COPY package*.json ./
RUN npm install

# Copy the rest of the application code.
# This layer will only be rebuilt if application code changes.
COPY . .

EXPOSE 4000

# Specify the command to run when thdoe container starts
CMD [ "node", "index.js" ]