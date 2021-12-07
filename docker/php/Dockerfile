ARG php_version=latest
FROM php:${php_version}-alpine

RUN apk --no-cache add git
RUN apk --no-cache add zip
RUN docker-php-ext-install pdo pdo_mysql
RUN curl -sL https://getcomposer.org/installer | php -- --install-dir /usr/bin --filename composer
