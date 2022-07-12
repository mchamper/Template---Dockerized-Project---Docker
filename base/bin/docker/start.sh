#!/bin/bash

. .env || exit 1

SERVICE=${1}

docker compose \
  -f compose.${ENV}.yml \
  up -d ${SERVICE}
