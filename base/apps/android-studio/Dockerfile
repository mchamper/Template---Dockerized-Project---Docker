ARG UBUNTU_VERSION=latest
FROM ubuntu:${UBUNTU_VERSION}

WORKDIR /var/www/app
RUN groupadd -g 1000 -r docker && useradd -u 1000 -g 1000 --create-home -r docker
RUN chown -R docker:docker /var/www/app
ENV PATH="/home/docker/.local/bin:${PATH}"

RUN apt update && apt install -y \
  build-essential \
  git \
  wget \
  curl \
  unzip \
  ca-certificates \
  default-jre

RUN apt clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ARG ANDROID_STUDIO_VERSION=2021.2.1.15
RUN cd /opt && wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/${ANDROID_STUDIO_VERSION}/android-studio-${ANDROID_STUDIO_VERSION}-linux.tar.gz
RUN cd /opt && tar -zxf android-studio-${ANDROID_STUDIO_VERSION}-linux.tar.gz && rm android-studio-${ANDROID_STUDIO_VERSION}-linux.tar.gz

USER docker

CMD sh /opt/android-studio/bin/studio.sh
