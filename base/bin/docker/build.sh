#!/bin/bash

. .env || exit 1

docker-compose \
  -f compose.${ENV}.yml \
  build $1
