ARG node_version=latest
FROM node:${node_version}-alpine

WORKDIR /home/node/app

RUN apk --no-cache add git
RUN apk --no-cache add zip

ARG npm_version=latest
RUN npm i -g npm@$npm_version

ARG angular_version=latest
RUN npm i -g @angular/cli@$angular_version

ARG ionic_version=latest
RUN npm i -g @ionic/cli@$ionic_version

USER node
