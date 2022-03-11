#!/bin/bash

. .env || exit 1

while :
do
	clear

  mutagen sync list \
    --label-selector project="${COMPOSE_PROJECT_NAME}"

	sleep 1
done

# mutagen sync monitor \
#   --label-selector project="${COMPOSE_PROJECT_NAME}"
