# syntax=docker/dockerfile:1

# Define the Node.js version as a build argument
ARG NODE_VERSION=20.14.0

# Stage 1: Build
FROM node:${NODE_VERSION}-alpine AS build

RUN yarn global add @nestjs/cli

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN yarn install --frozen-lockfile --production

# Copy the rest of the application files and build
COPY . .
RUN yarn build

# Stage 2: Production
FROM node:${NODE_VERSION}-alpine AS production

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY package*.json ./

# Expose the application port
EXPOSE 1105

# Command to run the application
CMD ["node", "dist/main"]
