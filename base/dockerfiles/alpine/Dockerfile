ARG ALPINE_VERSION=latest
FROM alpine:${ALPINE_VERSION}

WORKDIR /docker
RUN addgroup docker && adduser -D docker -u 1000 -G root -G www-data
RUN chown -R docker:docker /docker
ENV VIRTUAL_ENV=/opt/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
ENV PATH="/home/docker/.local/bin:${PATH}"

##############################
##############################

# Install common dependencies
RUN apk add --update --no-cache \
  bash \
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
  && python3 -m venv $VIRTUAL_ENV \
  && pip install --upgrade pip \
  && rm -rf /var/cache/apk/* && rm -rf /tmp/*

##############################
##############################

# Install aws cli
RUN pip install --upgrade awscli
RUN pip install --upgrade awsebcli
RUN pip install --upgrade botocore

USER docker
