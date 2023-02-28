#!/bin/bash

. .env || exit 1

SERVICE=${1}
MANAGER=${2:-"npm"}

SOURCE=$(bash base/bin/sources/get.sh ${SERVICE})
SUBFOLDER=""

if [[ ! -d "${SOURCE}" ]]
  then bash base/bin/sources/create.sh ${SERVICE}
  else SUBFOLDER="__NEW_APP__"
  fi

bash base/bin/docker/run.sh ${SERVICE} "
  cd ${SUBFOLDER}
  ionic config set -g npmClient ${MANAGER}
  ionic start app --no-git
  cp -a ./app ../
  rm -rf ./app
"

if [[ ${SUBFOLDER} = "" ]]; then
  bash base/bin/git/init.sh ${SERVICE}
fi
