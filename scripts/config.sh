#!/bin/bash

docker-compose \
  -f ../compose.${1:-dev}.yml \
  config
