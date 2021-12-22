#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi
. .env

for src in "${SRCS[@]}"; do
  service=${src%%:*}
  path="${src##*:}"

  if [[ $1 = $service ]]; then
    git clone $2 $path || exit 1

    cd $path
    git config user.name "$GIT_USER_NAME"
    git config user.email "$GIT_USER_EMAIL"

    if [[ $3 != "" ]]; then
      git checkout $3
    fi

    exit 0
  fi
done
