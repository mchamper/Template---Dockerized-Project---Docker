#!/bin/bash

ARGS=(
  -p dockerized-project
  -f base/dockerfiles/android-studio/docker-compose.yml
  down
)

docker compose "${ARGS[@]}"
