FROM node:14-alpine

LABEL Maintainer="locnh <loc.nguyen3@sotatek.com>"
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install --production=false && npm i -g @nestjs/cli
COPY . .
ENV PATH=$PATH:./node_modules/.bin
RUN echo $PATH
RUN yarn build
CMD ["yarn", "start:prod"]
