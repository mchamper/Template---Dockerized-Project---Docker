ARG node_version=latest
FROM node:${node_version}-alpine

WORKDIR /home/app/node

RUN apk --no-cache add git
RUN apk --no-cache add zip

ARG npm_version=latest
RUN npm i -g npm@$npm_version

ARG angular_version=latest
RUN npm i -g @angular/cli@$angular_version

USER node