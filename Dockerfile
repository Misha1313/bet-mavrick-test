FROM node:18.16.0-alpine

ARG APP

USER node:node
WORKDIR /app

COPY --chown=node:node . .
COPY --chown=node:node package*.json ./
COPY --chown=node:node nest-cli.json ./
COPY --chown=node:node tsconfig.* ./
COPY --chown=node:node /dist/ dist
COPY --chown=node:node /node_modules/ node_modules

ENV APP_MAIN_FILE=dist/src/main.js
CMD node ${APP_MAIN_FILE}