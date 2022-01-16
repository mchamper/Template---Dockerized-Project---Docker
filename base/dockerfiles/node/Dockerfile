ARG NODE_VERSION=latest
FROM node:${NODE_VERSION}-alpine

WORKDIR /home/node/app

RUN apk add --update --no-cache \
  git \
  zip \
  unzip \
  openssh \
  groff \
  python3 \
  py3-pip \
  py3-pynacl \
&& pip3 install --upgrade pip \
&& rm -rf /var/cache/apk/*

ARG NPM_VERSION=latest
RUN npm i -g npm@${NPM_VERSION}

ARG ANGULAR_VERSION=latest
RUN npm i -g @angular/cli@${ANGULAR_VERSION}

ARG IONIC_VERSION=latest
RUN npm i -g @ionic/cli@${IONIC_VERSION}
RUN npm i -g cordova-res

USER node

ENV PATH="/home/node/.local/bin:${PATH}"

RUN \
  pip3 install awscli --upgrade --user \
&& pip3 install awsebcli --upgrade --user
