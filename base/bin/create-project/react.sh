#!/bin/bash

. .env || exit 1

SERVICE=${1}

SOURCE=$(bash base/bin/sources/get.sh ${SERVICE})
SUBFOLDER=""

if [[ ! -d "${SOURCE}" ]]
  then bash base/bin/sources/create.sh ${SERVICE}
  else SUBFOLDER="__NEW_APP__"
  fi

bash base/bin/docker/run.sh ${SERVICE} "
  npx create-react-app ./${SUBFOLDER}
  rm -rf ./${SUBFOLDER}/.git
"

if [[ ${SUBFOLDER} = "" ]]; then
  bash base/bin/git/init.sh ${SERVICE}
fi
