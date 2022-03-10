#!/bin/bash

. .env || exit 1

SERVICE=${1}

if [[ ${MUTAGEN} != 1 ]]; then
  export MUTAGEN_SLEEP=0

  docker-compose \
    -f compose.${ENV}.yml \
    -f compose.${ENV}.volumes.yml \
    config ${SERVICE}

  exit
fi

docker-compose \
  -f compose.${ENV}.yml \
  config ${SERVICE}
