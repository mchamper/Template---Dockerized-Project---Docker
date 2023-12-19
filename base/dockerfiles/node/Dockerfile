ARG NODE_VERSION=latest
FROM node:${NODE_VERSION}

WORKDIR /docker/src
RUN chown -R node:node /docker
ENV PATH="/home/node/.local/bin:${PATH}"

##############################
##############################

# Install common dependencies
RUN apt-get update && apt-get install -y \
  git \
  zip \
  unzip \
  openssh-client \
  putty \
  rsync \
  groff \
  ffmpeg \
  && rm -rf /var/cache/apt/* && rm -rf /tmp/*

# Install image libraries
RUN apt-get update && apt-get install -y \
  libfreetype6 \
  libfreetype6-dev \
  libjpeg-dev \
  libpng-dev \
  && rm -rf /var/cache/apt/* && rm -rf /tmp/*

# Install python and aws cli
RUN apt-get update && apt-get install -y python; exit 0
RUN apt-get update && apt-get install -y python2; exit 0
RUN apt-get update && apt-get install -y \
  python3 \
  python3-pip \
  python3-dev libffi-dev musl-dev gcc make \
  && pip3 install --upgrade pip --break-system-packages \
  && rm -rf /var/cache/apt/* && rm -rf /tmp/*

##############################
##############################

# Install node dependencies
ARG NPM_VERSION=latest
ARG ANGULAR_VERSION=latest
ARG IONIC_VERSION=latest
ARG NESTJS_VERSION=latest
RUN npm i -g npm@${NPM_VERSION}
RUN npm i -g @angular/cli@${ANGULAR_VERSION}
RUN npm i -g @ionic/cli@${IONIC_VERSION}
RUN npm i -g @nestjs/cli@${NESTJS_VERSION}
RUN npm i -g npm-check-updates
RUN npm i -g cordova-res --unsafe-perm; exit 0

USER node

# Install aws cli
RUN pip3 install PyYAML==5.3.1 --break-system-packages
RUN pip3 install awscli --upgrade --user --break-system-packages
RUN pip3 install awsebcli --upgrade --user --break-system-packages
