#!/bin/bash

. .env || exit 1

docker-compose \
  -f compose.${ENV}.yml \
  run --rm $1 \
  /bin/sh -c "$2"
