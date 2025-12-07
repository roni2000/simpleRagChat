# Use Node LTS-slim base image (Debian-based)
FROM node:lts-slim

# Set working directory
WORKDIR /app

# Copy lock file and package.json FIRST to leverage Docker caching.
# This step only invalidates if package.json or the lock file changes.
COPY package*.json ./

# Install dependencies
# NOTE: Using 'npm install' here instead of 'npm ci' to resolve the earlier lock file mismatch error.
# If your local package-lock.json is fixed, you can switch back to 'npm ci --only=production'
RUN npm install --only=production

# --- Install necessary OS tools ---
# Fix: Use apt-get for Debian-based images (lts-slim) instead of apk (Alpine)
RUN apt-get update && apt-get install -y curl

# Copy all app source code
# This step is the LAST copy, so only source code changes invalidate the cache.
COPY . .

# Use existing 'node' user and group (UID/GID 1000)
# Ensure all app files are owned by this user/group (Optional, but good practice after COPY/install)
RUN chown -R node:node /app

# Switch to non-root user (UID 1000)
USER node

# Set environment
ENV NODE_ENV=production

# Expose app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]