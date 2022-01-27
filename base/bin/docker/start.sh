#!/bin/bash

. .env || exit 1

docker-compose \
  -f compose.${ENV}.yml \
  up -d $1
