ARG NGINX_VERSION=latest
FROM nginx:${NGINX_VERSION}-alpine

WORKDIR /var/www/html

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
&& pip3 install awscli --upgrade --user \
&& pip3 install awsebcli --upgrade --user \
&& rm -rf /var/cache/apk/*

ENV PATH="/root/.local/bin:${PATH}"
