#!/bin/bash

. .env || exit 1

mutagen sync terminate \
  --label-selector project="${COMPOSE_PROJECT_NAME}"
