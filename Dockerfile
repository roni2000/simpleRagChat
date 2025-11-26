# Use Node Alpine base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependencies and install them
COPY package*.json ./
RUN npm ci --only=production

# Copy all app source code
COPY . .

# Install curl (optional)
RUN apk add --no-cache curl

# Use existing 'node' user and group (UID/GID 1000)
# Ensure all app files are owned by this user/group
RUN chown -R node:node /app

# Switch to non-root user (UID 1000)
USER node

# Set environment
ENV NODE_ENV=production

# Expose app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]