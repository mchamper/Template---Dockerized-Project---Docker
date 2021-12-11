#!/bin/bash

. ../../.env

IFS=';' read -a sources <<< $SRCS

for src in "${sources[@]}"; do
  service=${src%%:*}
  path="../.${src##*:}"

  if [[ $1 = $service ]]; then
    cd $path

    git pull --all
    git flow release start $2
    git flow release finish $2 -m
    git push --all
    git push --tags

    exit 0
  fi
done
