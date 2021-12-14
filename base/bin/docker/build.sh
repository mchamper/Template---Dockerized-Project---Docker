#!/bin/bash

. .env

docker-compose \
  -f compose.${ENV}.yml \
  build $1
