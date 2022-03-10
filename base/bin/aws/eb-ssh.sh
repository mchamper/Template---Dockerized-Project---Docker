#!/bin/bash

. .env || exit 1

SERVICE=${1}
COMMAND=${2}

if [[ ${COMMAND} != "" ]]; then
  bash base/bin/docker/run.sh $SERVICE "eb ssh -n 1 --command \"${COMMAND}\""
else
  bash base/bin/docker/run.sh $SERVICE "eb ssh"
fi
