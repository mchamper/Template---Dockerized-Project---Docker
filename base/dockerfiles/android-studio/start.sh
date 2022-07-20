#!/bin/bash

ARGS=(
  -p dockerized-project
  -f compose.apps.android-studio.yml
  -f base/dockerfiles/android-studio/docker-compose.yml
  --env-file .env
  up -d
)

docker compose "${ARGS[@]}"
