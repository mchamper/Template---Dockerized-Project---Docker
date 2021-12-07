#!/bin/bash

. ../.env

docker-compose \
  -f ../compose.${ENV}.yml \
  exec $1 \
  /bin/sh -c "$2"
