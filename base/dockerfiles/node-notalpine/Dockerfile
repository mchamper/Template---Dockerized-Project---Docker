ARG NODE_VERSION=latest
FROM node:${NODE_VERSION}

WORKDIR /home/node/app
RUN chown -R node:node /home/node/app
ENV PATH="/home/node/.local/bin:${PATH}"

RUN apt-get update && apt-get install -y \
  git \
  zip \
  unzip \
  openssh-client \
  putty \
  rsync \
  groff

RUN apt-get update && apt-get install -y python; exit 0
RUN apt-get update && apt-get install -y python2; exit 0
RUN apt-get update && apt-get install -y \
  python3 \
  python3-pip \
  python3-dev libffi-dev musl-dev gcc make \
&& pip3 install --upgrade pip

RUN apt-get update && apt-get install -y \
  libfreetype6 \
  libfreetype6-dev \
  libjpeg-dev \
  libpng-dev

RUN rm -rf /var/cache/apt/* && rm -rf /tmp/*

ARG NPM_VERSION=latest
ARG ANGULAR_VERSION=latest
ARG IONIC_VERSION=latest
RUN npm i -g npm@${NPM_VERSION}
RUN npm i -g @angular/cli@${ANGULAR_VERSION}
RUN npm i -g @ionic/cli@${IONIC_VERSION}
RUN npm i -g cordova-res --unsafe-perm; exit 0

USER node

RUN pip3 install awscli --upgrade --user && pip3 install awsebcli --upgrade --user
