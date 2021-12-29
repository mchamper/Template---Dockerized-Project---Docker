#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi
. .env

for src in "${SRCS[@]}"; do
  service=${src%%:*}
  path="${src##*:}"

  if [[ $1 = $service || $1 = "docker" ]]; then
    if [[ $1 = "docker" ]]; then path=./; fi
    cd $path

    git config user.name "$GIT_USER_NAME"
    git config user.email "$GIT_USER_EMAIL"

    exit 0
  fi
done
