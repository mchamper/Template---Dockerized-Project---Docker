#!/bin/bash

. .env || exit 1

SERVICE=${1}
USER=${2:-root}

if [[ ${MUTAGEN} != 1 ]]; then
  docker-compose \
    -f compose.${ENV}.yml \
    -f compose.${ENV}.volumes.yml \
    exec -u ${USER} ${SERVICE} \
    /bin/sh

  exit
fi

docker-compose \
  -f compose.${ENV}.yml \
  exec -u ${USER} ${SERVICE} \
  /bin/sh
