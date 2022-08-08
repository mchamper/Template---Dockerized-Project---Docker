#!/bin/bash

SOURCE=${1}

if [[ ${2} != "--root" ]]; then
  SOURCE="${1}/docker"
fi

rm -rf .tmp-dockerized-project/.git

# CREATE
if [[ ! -f "${SOURCE}/version" && ! -f "${SOURCE}/version.txt" ]]; then
  mkdir -p .tmp-dockerized-project/bin/core
  mkdir -p .tmp-dockerized-project/credentials/.aws
  mkdir -p .tmp-dockerized-project/credentials/.ssh

  cp .tmp-dockerized-project/examples/.env .tmp-dockerized-project/.env
  cp .tmp-dockerized-project/examples/.env .tmp-dockerized-project/.env.example
  cp .tmp-dockerized-project/examples/compose.dev.yml .tmp-dockerized-project/compose.dev.yml
  cp .tmp-dockerized-project/examples/install.sh .tmp-dockerized-project/install.sh
  cp .tmp-dockerized-project/examples/build.sh .tmp-dockerized-project/build.sh
  cp .tmp-dockerized-project/examples/start.sh .tmp-dockerized-project/start.sh
  cp .tmp-dockerized-project/examples/stop.sh .tmp-dockerized-project/stop.sh
  cp .tmp-dockerized-project/examples/database-exports/.env .tmp-dockerized-project/database-exports/.env
  cp -r .tmp-dockerized-project/examples/bin/core .tmp-dockerized-project/bin
  cp -r .tmp-dockerized-project/examples/credentials/.aws .tmp-dockerized-project/credentials

  echo "/.env" > .tmp-dockerized-project/.gitignore

  mkdir -p "${SOURCE}"

# UPDATE
else
  cp .tmp-dockerized-project/examples/bin/core/__base.sh .tmp-dockerized-project/bin/core/__base.sh
  rm -f .tmp-dockerized-project/.gitignore
fi

rm -rf .tmp-dockerized-project/downloads
rm -f .tmp-dockerized-project/base/bin/create-dockerized-project.sh

cp -a .tmp-dockerized-project/. "${SOURCE}"
rm -rf .tmp-dockerized-project
