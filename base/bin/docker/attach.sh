#!/bin/bash

. .env || exit 1

SERVICE=${1}
USER=${2:-root}

docker compose \
  -f compose.${ENV}.yml \
  exec -u ${USER} ${SERVICE} \
  /bin/sh
