#!/bin/bash

. ../.env

docker-compose \
  -f ../compose.${ENV}.yml \
  restart $1
