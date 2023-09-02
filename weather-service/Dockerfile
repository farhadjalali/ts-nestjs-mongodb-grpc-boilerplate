# api-service/Dockerfile

# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/app

# Copy package.json and package-lock.json (if available)
COPY weather-service/package.json weather-service/yarn.lock weather-service/tsconfig*.json tsconfig*.json ./
COPY proto ../proto

# Install Yarn globally and then the dependencies using Yarn
RUN yarn install

# Copy the source code into the container
COPY weather-service/src ./src/

# Compile TypeScript
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["yarn", "start"]
