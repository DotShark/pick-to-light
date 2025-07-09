FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Expose port and start
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--port", "4173", "--host"]
