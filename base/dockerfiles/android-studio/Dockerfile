ARG UBUNTU_VERSION=latest
FROM ubuntu:${UBUNTU_VERSION}

RUN apt update
RUN apt install -y \
  git \
  wget \
  curl \
  ca-certificates \
  unzip \
  default-jre

ARG ANDROID_STUDIO_VERSION=2021.2.1.15
RUN cd /opt && wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/${ANDROID_STUDIO_VERSION}/android-studio-${ANDROID_STUDIO_VERSION}-linux.tar.gz
RUN cd /opt && tar -zxf android-studio-${ANDROID_STUDIO_VERSION}-linux.tar.gz && rm android-studio-${ANDROID_STUDIO_VERSION}-linux.tar.gz

CMD sh /opt/android-studio/bin/studio.sh
