#!/bin/bash

git clone git@github.com:mchamper/Template---Dockerized-Project---Docker.git ./.tmp-dockerized-project || exit 0
rm -rf ./.tmp-dockerized-project/.git

# CREATE
if [ ! -f "$1/docker/version" ]; then
  cp ./.tmp-dockerized-project/examples/.env.example ./.tmp-dockerized-project/.env
  cp ./.tmp-dockerized-project/examples/compose.example.yml ./.tmp-dockerized-project/compose.dev.yml
  cp ./.tmp-dockerized-project/examples/install.example.sh ./.tmp-dockerized-project/install.sh

  echo "/.env" > .gitignore

  mkdir -p "$1/docker"

# UPDATE
else
  rm -f ./.tmp-dockerized-project/.gitignore
fi

rm -rf ./.tmp-dockerized-project/examples

cp -a ./.tmp-dockerized-project/. "$1/docker"
rm -rf ./.tmp-dockerized-project
