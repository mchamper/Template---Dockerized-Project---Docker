FROM php:8.2-fpm-alpine

WORKDIR /var/www/html

# Crear un usuario y grupo no privilegiado
RUN addgroup -g 1000 docker && \
  adduser -G docker -u 1000 -D -s /bin/sh docker && \
  chown -R docker:docker /var/www/html

# Instalar dependencias básicas de Alpine
RUN apk add --update --no-cache \
  linux-headers \
  bash \
  curl \
  git \
  zip \
  unzip \
  g++ \
  make \
  openssh \
  openssl \
  putty \
  rsync \
  groff \
  supervisor

# Instalar librerías necesarias para extensiones PHP
RUN apk add --no-cache \
  $PHPIZE_DEPS \
  ffmpeg \
  libpng-dev \
  libjpeg-turbo-dev \
  libwebp-dev \
  freetype-dev \
  libxml2-dev \
  oniguruma-dev \
  postgresql-dev \
  icu-dev \
  unixodbc \
  unixodbc-dev \
  freetds-dev \
  libtool \
  libmemcached-dev \
  libzip-dev \
  cyrus-sasl-dev

# Instalar extensiones PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp && \
  docker-php-ext-install \
  gd \
  intl \
  mbstring \
  pdo \
  pdo_mysql \
  pdo_pgsql \
  xml \
  exif \
  zip \
  opcache \
  pcntl && \
  docker-php-ext-enable opcache

# Copiar archivos de configuración de php
COPY ./docker/deploy/dockerfiles/backend/php.ini /usr/local/etc/php/conf.d/000_php.ini

# Configurar cronjobs
RUN echo "* * * * * php /var/www/html/artisan schedule:run >> /var/log/cron.log 2>&1" > /etc/crontabs/laravel
RUN crontab /etc/crontabs/laravel

# Exponer logs de cron
RUN touch /var/log/cron.log \
  && chown docker:docker /var/log/cron.log

# Instalar Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Copiar el código del proyecto
ARG ENVIRONMENT_FILE
COPY ./backend .
COPY ./docker/environments/backend/${ENVIRONMENT_FILE}/.env .env
COPY ./docker/environments/backend/${ENVIRONMENT_FILE}/admin-users.json admin-users.json

# Instalar dependencias de Composer
RUN composer install \
  --no-dev \
  --optimize-autoloader \
  --no-interaction \
  --prefer-dist

# Optimización de configuración, rutas y vistas para producción
RUN php artisan config:clear \
  && php artisan config:cache \
  && php artisan route:cache \
  && php artisan view:cache

# Crear link de storage a public
RUN php artisan storage:link || true

# Ajustar permisos (importante para storage y bootstrap/cache)
RUN chown -R docker:www-data storage bootstrap/cache

# Exponer el puerto de PHP-FPM
EXPOSE 9000

# Cambiar al usuario no privilegiado
USER docker

# Comando predeterminado
CMD ["php-fpm"]
