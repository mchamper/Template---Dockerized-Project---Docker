#!/bin/bash

docker-compose \
  -f ../compose.${3:-dev}.yml \
  exec $1 \
  /bin/sh -c "$2"
