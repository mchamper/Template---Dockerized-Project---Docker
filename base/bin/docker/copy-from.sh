#!/bin/bash

. .env || exit 1

SERVICE=${1}
CONTAINER_PATH=${2}
HOST_PATH=${3}

docker compose \
  -f compose.${ENV}.yml \
  cp ${SERVICE}:${CONTAINER_PATH} ${HOST_PATH}
