#!/bin/bash

ARGS=(
  -p dockerized-project
  -f compose.apps.android-studio.yml
  -f base/dockerfiles/android-studio/docker-compose.yml
  --env-file .env
  down
)

docker compose "${ARGS[@]}"
