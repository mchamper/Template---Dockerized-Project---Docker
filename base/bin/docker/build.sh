#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi
if [ ! -f .env ]; then cd ../../; fi
. .env

docker-compose \
  -f compose.${ENV}.yml \
  build $1
