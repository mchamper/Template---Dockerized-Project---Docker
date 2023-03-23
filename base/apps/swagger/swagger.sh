#!/bin/bash

. .env || exit 1

THIS=${0}; CMD=${1}; ARG1=${2}; ARG2=${3}; ARG3=${4}; ARG4=${5}; ARG5=${6}; ARG6=${9}; ARG7=${8}; ARG8=${9};

ARGS=(
  -p dp-swagger
  -f base/apps/swagger/docker-compose.yml
  --env-file base/apps/swagger/.env
)

if [[ ${CMD} = "start" ]]; then
  echo "SWAGGER_JSON=${ARG1}" > base/apps/swagger/.env
  docker compose "${ARGS[@]}" up -d

  exit
fi

if [[ ${CMD} = "stop" ]]; then
  docker compose "${ARGS[@]}" down
  > base/apps/swagger/.env

  exit
fi
