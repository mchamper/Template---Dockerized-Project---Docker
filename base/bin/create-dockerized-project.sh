#!/bin/bash

path=$1

if [[ $2 != "--root" ]]; then
  path="$1/docker"
fi

rm -rf ./.tmp-dockerized-project/.git

# CREATE
if [ ! -f "$path/version" ]; then
  cp ./.tmp-dockerized-project/examples/.example.env ./.tmp-dockerized-project/.env
  cp ./.tmp-dockerized-project/examples/.example.env ./.tmp-dockerized-project/.env.example
  cp ./.tmp-dockerized-project/examples/compose.example.yml ./.tmp-dockerized-project/compose.dev.yml
  cp ./.tmp-dockerized-project/examples/install.example.sh ./.tmp-dockerized-project/install.sh
  cp ./.tmp-dockerized-project/examples/.database-exports.example.env ./.tmp-dockerized-project/database-exports/.env

  echo "/.env" > ./.tmp-dockerized-project/.gitignore

  mkdir -p "$path"

# UPDATE
else
  rm -f ./.tmp-dockerized-project/.gitignore
fi

rm -rf ./.tmp-dockerized-project/examples
rm -rf ./.tmp-dockerized-project/downloads
rm -f ./.tmp-dockerized-project/base/commands/create-dockerized-project.sh

cp -a ./.tmp-dockerized-project/. "$path"
rm -rf ./.tmp-dockerized-project
