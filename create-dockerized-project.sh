#!/bin/bash

git clone git@github.com:mchamper/Template---Dockerized-Project---Docker.git "$1/docker" || exit 0
rm -rf "$1/docker/.git"

cd "$1/docker"

if [ ! -f "examples/.env.example" ]; then cp examples/.env.example .env; fi
if [ ! -f "examples/compose.example.yml" ]; then cp examples/compose.example.yml compose.dev.yml; fi
if [ ! -f "examples/install.example.sh" ]; then cp examples/install.example.sh intall.sh; fi

echo "
/.env
/docker/_data
/docker/_customs
" > .gitignore
