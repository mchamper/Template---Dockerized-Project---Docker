#!/bin/bash

. .env || exit 1

SERVICE=${1}
PACKAGE_MANAGER=${2:-"yarn"}

SOURCE=$(bash base/bin/sources/get.sh ${SERVICE})
SUBFOLDER=""

if [[ ! -d "${SOURCE}" ]]; then
  bash base/bin/sources/create.sh ${SERVICE};
fi

bash base/bin/docker/run.sh ${SERVICE} "
  ionic config set -g npmClient ${PACKAGE_MANAGER};
  ionic start app --no-git;
  cp -a ./app ../;
  rm -rf ./app;
"

bash base/bin/git/init.sh ${SERVICE}
