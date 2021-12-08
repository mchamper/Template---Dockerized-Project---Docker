ARG NODE_VERSION=latest
FROM node:${NODE_VERSION}-alpine

WORKDIR /home/node/app

RUN apk --no-cache add git zip unzip

ARG NPM_VERSION=latest
RUN npm i -g npm@${NPM_VERSION}

ARG ANGULAR_VERSION=latest
RUN npm i -g @angular/cli@${ANGULAR_VERSION}

ARG IONIC_VERSION=latest
RUN npm i -g @ionic/cli@${IONIC_VERSION}

USER node
