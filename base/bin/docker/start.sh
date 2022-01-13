#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env

docker-compose \
  -f compose.${ENV}.yml \
  up -d $1
