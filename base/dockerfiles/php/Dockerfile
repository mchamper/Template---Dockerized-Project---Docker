ARG PHP_VERSION=latest
FROM php:${PHP_VERSION}-alpine

WORKDIR /var/www/html

RUN apk add --update --no-cache \
  git \
  zip \
  unzip \
  openssh \
  groff

RUN apk add --update --no-cache \
  python3 \
  py3-pip \
  py3-pynacl \
&& pip3 install --upgrade pip

RUN apk add --update --no-cache \
  libzip \
  libzip-dev \
&& docker-php-ext-install \
  pdo \
  pdo_mysql \
  mysqli \
  zip \
&& apk del --no-cache \
  libzip-dev

RUN apk add --no-cache \
  freetype \
  freetype-dev \
  libjpeg-turbo \
  libjpeg-turbo-dev \
  libpng \
  libpng-dev \
&& docker-php-ext-configure gd \
  --with-freetype=/usr/include/ \
  # --with-png=/usr/include/ \
  --with-jpeg=/usr/include/ \
&& docker-php-ext-install gd \
&& docker-php-ext-enable gd \
&& apk del --no-cache \
  freetype-dev \
  libjpeg-turbo-dev \
  libpng-dev

RUN rm -rf /var/cache/apk/* && rm -rf /tmp/*

ARG COMPOSER_VERSION=
RUN curl -sL https://getcomposer.org/installer | php -- --install-dir /usr/bin --filename composer
RUN composer self-update ${COMPOSER_VERSION}

ARG USER=docker
ARG UID=1000
ARG GID=1000
RUN addgroup ${USER} && adduser -D ${USER} -u ${UID} -G www-data -G root
RUN chown ${USER}:${USER} /var/www/html

USER ${USER}
ENV PATH="/home/docker/.local/bin:${PATH}"

RUN pip3 install awscli --upgrade --user && pip3 install awsebcli --upgrade --user
