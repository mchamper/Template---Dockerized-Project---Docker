ARG NGINX_VERSION=latest
FROM nginx:${NGINX_VERSION}-alpine

ARG NGINX_ROOT=/var/www/html
RUN echo "root ${NGINX_ROOT};" > /etc/nginx/conf.d/root.conf

WORKDIR /var/www/html
ENV PATH="/root/.local/bin:${PATH}"

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

RUN rm -rf /var/cache/apk/* && rm -rf /tmp/*

RUN pip3 install awscli --upgrade --user && pip3 install awsebcli --upgrade --user
