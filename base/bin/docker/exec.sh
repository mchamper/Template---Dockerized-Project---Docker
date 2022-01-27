#!/bin/bash

. .env || exit 1

docker-compose \
  -f compose.${ENV}.yml \
  exec $1 \
  /bin/sh -c "$2"
