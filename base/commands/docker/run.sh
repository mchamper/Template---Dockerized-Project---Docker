#!/bin/bash

. ../../.env

docker-compose \
  -f ../../compose.${ENV}.yml \
  run --rm $1 \
  bash -c "$2"
