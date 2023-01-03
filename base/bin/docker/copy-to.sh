#!/bin/bash

. .env || exit 1

SERVICE=${1}
HOST_PATH=${2}
CONTAINER_PATH=${3}

docker compose \
  -f compose.${ENV}.yml \
  cp ${HOST_PATH} ${SERVICE}:${CONTAINER_PATH}
