#!/bin/bash

. .env || exit 1

SERVICE=${1}
CONTAINER_NAME=$(docker ps | grep ${COMPOSE_PROJECT_NAME}_${SERVICE} | awk '{print $NF}')

if [[ -n "${CONTAINER_NAME}" ]]; then
  echo "${CONTAINER_NAME}"
else
  # Use default name schema assigned when a compose project is first run.
  echo ${COMPOSE_PROJECT_NAME}_${SERVICE}_1
fi
