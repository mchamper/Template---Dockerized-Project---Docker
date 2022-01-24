#!/bin/bash

path=$1

if [[ $2 != "--root" ]]; then
  path="$1/docker"
fi

rm -rf ./.tmp-dockerized-project/.git

# CREATE
if [[ ! -f "$path/version" && ! -f "$path/version.txt" ]]; then
  cp ./.tmp-dockerized-project/examples/.env.example ./.tmp-dockerized-project/.env
  cp ./.tmp-dockerized-project/examples/.env.example ./.tmp-dockerized-project/.env.example
  cp ./.tmp-dockerized-project/examples/compose.example.yml ./.tmp-dockerized-project/compose.dev.yml
  cp ./.tmp-dockerized-project/examples/install.example.sh ./.tmp-dockerized-project/install.sh
  cp ./.tmp-dockerized-project/examples/database-exports/.env.example ./.tmp-dockerized-project/database-exports/.env
  cp ./.tmp-dockerized-project/examples/bin/core/web.sh ./.tmp-dockerized-project/bin/core/web.sh
  cp ./.tmp-dockerized-project/examples/bin/core/mobile.sh ./.tmp-dockerized-project/bin/core/mobile.sh
  cp ./.tmp-dockerized-project/examples/bin/core/backoffice.sh ./.tmp-dockerized-project/bin/core/backoffice.sh
  cp ./.tmp-dockerized-project/examples/bin/core/backend.sh ./.tmp-dockerized-project/bin/core/backend.sh
  cp ./.tmp-dockerized-project/examples/bin/core/database.sh ./.tmp-dockerized-project/bin/core/database.sh

  mkdir -p ./.tmp-dockerized-project/credentials/.aws
  mkdir -p ./.tmp-dockerized-project/credentials/.ssh

  echo "/.env" > ./.tmp-dockerized-project/.gitignore

  mkdir -p "$path"

# UPDATE
else
  rm -f ./.tmp-dockerized-project/.gitignore
fi

rm -rf ./.tmp-dockerized-project/examples
rm -rf ./.tmp-dockerized-project/downloads
rm -f ./.tmp-dockerized-project/base/bin/create-dockerized-project.sh

cp -a ./.tmp-dockerized-project/. "$path"
rm -rf ./.tmp-dockerized-project
