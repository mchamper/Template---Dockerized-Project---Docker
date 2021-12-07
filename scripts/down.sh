#!/bin/bash

docker-compose \
  -f ../compose.${2:-dev}.yml \
  down $1
