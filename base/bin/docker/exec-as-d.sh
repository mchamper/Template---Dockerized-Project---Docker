#!/bin/bash

. .env || exit 1

SERVICE=${1}
COMMAND=${2}
USER=${3:-root}

docker compose \
  -f compose.${ENV}.yml \
  exec -u ${USER} -d ${SERVICE} \
  /bin/sh -c "${COMMAND}"
