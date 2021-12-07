#!/bin/bash

. ../.env

docker-compose \
  -f ../compose.${ENV}.yml \
  down $1
