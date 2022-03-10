#!/bin/bash

. .env || exit 1

mutagen sync list \
  --label-selector project="${COMPOSE_PROJECT_NAME}"
