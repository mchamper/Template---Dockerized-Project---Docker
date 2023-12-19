ARG ALPINE_VERSION=latest
FROM alpine:${ALPINE_VERSION}

WORKDIR /docker
RUN addgroup docker && adduser -D docker -u 1000 -G root -G www-data
RUN chown -R docker:docker /docker
ENV PATH="/home/docker/.local/bin:${PATH}"

##############################
##############################

# Install common dependencies
RUN apk add --update --no-cache \
  git \
  zip \
  unzip \
  openssh \
  openssl \
  putty \
  rsync \
  groff \
  ffmpeg \
  && rm -rf /var/cache/apk/* && rm -rf /tmp/*

# Install python
RUN apk add --update --no-cache python2; exit 0
RUN apk add --update --no-cache \
  python3 \
  py3-pip \
  py3-pynacl \
  python3-dev libffi-dev openssl-dev musl-dev gcc make \
  && pip3 install --upgrade pip --break-system-packages \
  && rm -rf /var/cache/apk/* && rm -rf /tmp/*

##############################
##############################

USER docker

# Install aws cli
RUN pip3 install PyYAML==5.3.1 --break-system-packages
RUN pip3 install awscli --upgrade --user --break-system-packages
RUN pip3 install awsebcli --upgrade --user --break-system-packages
