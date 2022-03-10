#!/bin/bash

. .env || exit 1

SERVICE=${1}
ENVS=($(cat "${2}"))

for ENV in ${ENVS[@]}; do :
  ENVS_STRING+=" ${ENV}"
done

if [[ ${3} = "--echo" ]]; then
  echo "eb setenv${ENVS_STRING}"
else
  bash base/bin/docker/run.sh ${SERVICE} "
    eb setenv${ENVS_STRING}
  "
fi
