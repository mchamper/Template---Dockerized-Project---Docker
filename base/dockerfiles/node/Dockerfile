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
  putty \
  rsync \
  groff

RUN apk add --update --no-cache python2; exit 0
RUN apk add --update --no-cache \
  python3 \
  py3-pip \
  py3-pynacl \
  python3-dev libffi-dev openssl-dev musl-dev gcc make \
&& pip3 install --upgrade pip

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
