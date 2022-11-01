ARG NGINX_VERSION=latest
FROM nginx:${NGINX_VERSION}

ARG NGINX_ROOT=/var/www/html
RUN echo "root ${NGINX_ROOT};" > /etc/nginx/conf.d/root.conf

WORKDIR /var/www/html
ENV PATH="/root/.local/bin:${PATH}"

RUN apt-get update && apt-get install -y \
  git \
  zip \
  unzip \
  openssh-client \
  putty \
  rsync \
  groff

RUN mkdir -p /certs
RUN openssl req -x509 -nodes -days 720 -newkey rsa:2048 -keyout /certs/server.key -out /certs/server.crt -subj "/C=AR/ST=Docker/L=Docker/O=Docker/OU=Docker/CN=Docker"

RUN apt-get update && apt-get install -y python; exit 0
RUN apt-get update && apt-get install -y python2; exit 0
RUN apt-get update && apt-get install -y \
  python3 \
  python3-pip \
  python3-dev libffi-dev musl-dev gcc make \
&& pip3 install --upgrade pip

RUN rm -rf /var/cache/apt/* && rm -rf /tmp/*

RUN pip3 install awscli --upgrade --user && pip3 install awsebcli --upgrade --user

RUN apt-get install bash
RUN touch /root/.bashrc

ARG NODE_VERSION=16
ARG NPM_VERSION=latest
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
RUN . /root/.bashrc \
  && nvm install ${NODE_VERSION} && nvm use ${NODE_VERSION} \
  && npm i -g npm@${NPM_VERSION}
