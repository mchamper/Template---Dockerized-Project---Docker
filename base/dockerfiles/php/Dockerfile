ARG PHP_VERSION=latest
FROM php:${PHP_VERSION}-alpine

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

RUN docker-php-ext-install pdo pdo_mysql mysqli

RUN curl -sL https://getcomposer.org/installer | php -- --install-dir /usr/bin --filename composer

ARG USER=docker
ARG UID=1000
ARG GID=1000
RUN addgroup ${USER} && adduser -D ${USER} -u ${UID} -G www-data -G root
RUN chown ${USER}:${USER} /var/www/html

USER ${USER}
