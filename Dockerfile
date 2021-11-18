
# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:12-alpine
ENV API_GATEWAY_PORT=8009

ENV MASTER_BASE_URL=https://shop-service-ti5nf7kn3a-ew.a.run.app/
ENV PRODUCT_LOG_LEVEL=warn

ENV MODE=PROD
ENV GCP_IDENTITY_TOKEN_URL=http://metadata/computeMetadata/v1/instance/service-accounts/default/identity

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy local code to the container image.
COPY . ./

# Build the application
RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "run", "start:shop-bus-api" ]