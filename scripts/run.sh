#!/bin/bash

. ../.env

docker-compose \
  -f ../compose.${ENV}.yml \
  run --no-deps --rm $1 \
  /bin/sh -c "$2"
