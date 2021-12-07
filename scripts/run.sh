#!/bin/bash

docker-compose \
  -f ../compose.${3:-dev}.yml \
  run --no-deps --rm $1 \
  /bin/sh -c "$2"
