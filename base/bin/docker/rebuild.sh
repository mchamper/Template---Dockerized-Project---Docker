#!/bin/bash

. .env || exit 1

SERVICE=${1}

docker compose \
  -f compose.${ENV}.yml \
  build ${SERVICE} --no-cache
