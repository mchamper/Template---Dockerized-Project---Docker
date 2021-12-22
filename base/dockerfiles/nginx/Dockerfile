ARG NGINX_VERSION=latest
FROM nginx:${NGINX_VERSION}-alpine

WORKDIR /var/www/html

RUN apk add --update --no-cache \
  git \
  zip \
  unzip \
  python3 \
  py3-pip \
&& pip3 install --upgrade pip \
&& pip3 install awscli \
# && pip3 install awsebcli --upgrade --user \
&& rm -rf /var/cache/apk/*
