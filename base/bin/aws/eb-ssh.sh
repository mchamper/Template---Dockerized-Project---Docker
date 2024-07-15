#!/bin/bash

. .env || exit 1

SERVICE=${1}
COMMAND=${2}

if [[ ${COMMAND} != "" ]]; then
  bash base/bin/docker/run.sh 0-aws "
    cd /docker/src/${SERVICE} || exit 1
    eb ssh -n 1 --command \"${COMMAND}\"
  "
else
  bash base/bin/docker/run.sh 0-aws "
    cd /docker/src/${SERVICE} || exit 1
    eb ssh
  "
fi
