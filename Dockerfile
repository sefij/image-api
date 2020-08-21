FROM node:10.15.3-alpine
# Env
ENV TIME_ZONE=Asia/Jerusalem
ENV ENV_NAME dev
ENV EGG_SERVER_ENV dev
ENV NODE_ENV dev
ENV NODE_CONFIG_ENV dev
# Set the timezone in docker
RUN apk add --no-cache tzdata
ENV TZ Asia/Jerusalem
# Create Directory for the Container
WORKDIR /usr/src/app
# Only copy the package.json file to work directory
COPY package.json .
# Install all Packages
RUN npm install
# Copy all other source code to work directory
ADD . /usr/src/app
# TypeScript
RUN npm run build
# Start
CMD [ "npm", "start" ]
EXPOSE 3000