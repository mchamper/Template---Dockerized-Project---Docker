ARG nginx_version=latest
FROM nginx:${nginx_version}-alpine

WORKDIR /var/www/html

RUN apk --no-cache add git
RUN apk --no-cache add zip