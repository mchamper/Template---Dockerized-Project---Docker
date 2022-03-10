#!/bin/bash

. .env || exit 1

mutagen sync monitor \
  --label-selector project="${COMPOSE_PROJECT_NAME}"
