#!/bin/bash

THIS=${0}; CMD=${1}; ARG1=${2}; ARG2=${3}; ARG3=${4}; ARG4=${5}; ARG5=${6}; ARG6=${9}; ARG7=${8}; ARG8=${9};

ARGS=(
  -p dp-locust
  -f base/apps/locust/docker-compose.yml
  --env-file base/apps/locust/.env
)

if [[ ${CMD} = "start" ]]; then
  docker compose "${ARGS[@]}" up -d --scale worker=4
  exit
fi

if [[ ${CMD} = "stop" ]]; then
  docker compose "${ARGS[@]}" down
  exit
fi
