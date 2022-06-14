ARG NGINX_VERSION=latest
FROM nginx:${NGINX_VERSION}-alpine

WORKDIR /var/www/html
ENV PATH="/root/.local/bin:${PATH}"

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

RUN pip3 install awscli --upgrade --user && pip3 install awsebcli --upgrade --user
