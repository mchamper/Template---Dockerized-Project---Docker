FROM ubuntu:22.04

WORKDIR /docker
RUN addgroup docker && useradd -m docker -u 1000 -g root -g www-data
RUN chown -R docker:docker /docker

##############################
##############################

# Install common dependencies
RUN apt-get update && apt-get install -y \
  git \
  zip \
  unzip \
  openssh-client \
  putty \
  rsync \
  groff \
  ffmpeg \
  supervisor \
  curl \
  sudo \
  && rm -rf /var/cache/apt/* && rm -rf /tmp/*

# Add cloudflare gpg key
RUN sudo mkdir -p --mode=0755 /usr/share/keyrings
RUN curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null

# Add this repo to your apt repositories
RUN  echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared jammy main' | sudo tee /etc/apt/sources.list.d/cloudflared.list

# Install cloudflared
RUN sudo apt-get update && sudo apt-get install cloudflared

ARG CLOUDFLARED_TOKEN
RUN cloudflared service install ${CLOUDFLARED_TOKEN}
RUN mkdir -p /home/docker/.ssh && chown -R docker:docker /home/docker/.ssh

USER docker
