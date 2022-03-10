#!/bin/bash

. .env || exit 1

SERVICE=${1}
PACKAGE_MANAGER=${2:-"yarn"}

bash base/bin/docker/run.sh ${SERVICE} "
  ionic config set -g npmClient ${PACKAGE_MANAGER};
  ionic start app --no-git;
  cp -rf ./app ../;
  rm -rf ./app;
"

bash base/bin/git/init.sh ${SERVICE}
