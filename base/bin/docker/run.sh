#!/bin/bash

. .env

docker-compose \
  -f compose.${ENV}.yml \
  run --rm $1 \
  /bin/sh -c "$2"