#!/bin/bash

. ../.env

IFS=';' read -a sources <<< $SRCS

for src in "${sources[@]}"; do
  service=${src%%:*}
  path=${src##*:}

  if [ $1=$service ]; then
    git clone $2 $path || exit 0

    cd $path
    git config user.name "$GIT_USER_NAME"
    git config user.email "$GIT_USER_EMAIL"
  fi
done
