#!/bin/bash

. .env || exit 1

SERVICE=${1}
COMMAND=${2}

docker compose \
  -f compose.${ENV}.yml \
  run --rm -d ${SERVICE} \
  /bin/sh -c "${COMMAND}"
