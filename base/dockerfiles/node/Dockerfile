ARG NODE_VERSION=latest
FROM node:${NODE_VERSION}-alpine

WORKDIR /home/node/app
RUN chown -R node:node /home/node/app
ENV PATH="/home/node/.local/bin:${PATH}"

RUN apk add --update --no-cache \
  git \
  zip \
  unzip \
  openssh \
  openssl \
  putty \
  rsync \
  groff

RUN mkdir -p /certs
RUN openssl req -x509 -nodes -days 720 -newkey rsa:2048 -keyout /certs/server.key -out /certs/server.crt -subj "/C=AR/ST=Docker/L=Docker/O=Docker/OU=Docker/CN=Docker"

RUN apk add --update --no-cache python2; exit 0
RUN apk add --update --no-cache \
  python3 \
  py3-pip \
  py3-pynacl \
  python3-dev libffi-dev openssl-dev musl-dev gcc make \
&& pip3 install --upgrade pip

RUN apk add --update --no-cache \
  freetype \
  freetype-dev \
  libjpeg-turbo \
  libjpeg-turbo-dev \
  libpng \
  libpng-dev \
  build-base \
  libc6-compat \
&& apk del --no-cache \
  freetype-dev \
  libjpeg-turbo-dev \
  libpng-dev

RUN apk add --update --no-cache \
  ffmpeg

RUN apk add --update --no-cache \
  nginx

RUN rm -rf /var/cache/apk/* && rm -rf /tmp/*

ARG NPM_VERSION=latest
ARG ANGULAR_VERSION=latest
ARG IONIC_VERSION=latest
RUN npm i -g npm@${NPM_VERSION}
RUN npm i -g @angular/cli@${ANGULAR_VERSION}
RUN npm i -g @ionic/cli@${IONIC_VERSION}
RUN npm i -g cordova-res --unsafe-perm; exit 0

USER node

RUN pip3 install awscli --upgrade --user && pip3 install awsebcli --upgrade --user
