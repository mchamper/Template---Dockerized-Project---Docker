#!/bin/bash

. ../../.env

docker-compose \
  -f ../../compose.${ENV}.yml \
  up -d $1
