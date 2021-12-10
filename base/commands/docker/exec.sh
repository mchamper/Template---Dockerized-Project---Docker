#!/bin/bash

. ../../.env

docker-compose \
  -f ../../compose.${ENV}.yml \
  exec $1 \
  bash -c "$2"
