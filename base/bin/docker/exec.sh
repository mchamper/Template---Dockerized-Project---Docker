#!/bin/bash

. .env || exit 1

SERVICE=${1}
COMMAND=${2}

if [[ ${MUTAGEN} != 1 ]]; then
  docker-compose \
    -f compose.${ENV}.yml \
    -f compose.${ENV}.volumes.yml \
    exec ${SERVICE} \
    /bin/sh -c "${COMMAND}"

  exit
fi

docker-compose \
  -f compose.${ENV}.yml \
  exec ${SERVICE} \
  /bin/sh -c "${COMMAND}"
