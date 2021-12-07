#!/bin/bash

docker-compose \
  -f ../compose.${2:-dev}.yml \
  up -d $1
