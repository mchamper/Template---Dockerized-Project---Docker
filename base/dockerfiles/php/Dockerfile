ARG PHP_VERSION=latest
FROM php:${PHP_VERSION}-alpine

WORKDIR /var/www/html
RUN addgroup docker && adduser -D docker -u 1000 -G www-data -G root
RUN chown -R docker:docker /var/www/html
ENV PATH="/home/docker/.local/bin:${PATH}"

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

RUN apk add --update --no-cache \
  freetype \
  freetype-dev \
  libjpeg-turbo \
  libjpeg-turbo-dev \
  libpng \
  libpng-dev \
  build-base \
  libc6-compat \
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

USER docker

RUN pip3 install awscli --upgrade --user && pip3 install awsebcli --upgrade --user
RUN pip3 install locust
