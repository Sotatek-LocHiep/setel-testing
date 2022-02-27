FROM node:14-alpine

LABEL Maintainer="locnh <loc.nguyen3@sotatek.com>"
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install --production=false && npm i -g @nestjs/cli
COPY . .
RUN yarn build
ARG PAYMENT_SERVICE_PORT
EXPOSE $PAYMENT_SERVICE_PORT
CMD ["yarn", "start:prod"]
