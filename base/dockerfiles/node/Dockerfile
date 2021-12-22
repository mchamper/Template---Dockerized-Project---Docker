ARG NODE_VERSION=latest
FROM node:${NODE_VERSION}-alpine

WORKDIR /home/node/app

RUN apk add --update --no-cache \
  git \
  zip \
  unzip \
  python3 \
  py3-pip \
&& pip3 install --upgrade pip \
&& pip3 install awscli \
&& pip3 install awsebcli --upgrade --user \
&& rm -rf /var/cache/apk/*

ARG NPM_VERSION=latest
RUN npm i -g npm@${NPM_VERSION}

ARG ANGULAR_VERSION=latest
RUN npm i -g @angular/cli@${ANGULAR_VERSION}

ARG IONIC_VERSION=latest
RUN npm i -g @ionic/cli@${IONIC_VERSION}

USER node
