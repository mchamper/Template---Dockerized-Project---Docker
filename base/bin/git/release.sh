#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi
. .env

for src in "${SRCS[@]}"; do
  service=${src%%:*}
  path="${src##*:}"

  if [[ $1 = $service || $1 = "docker" ]]; then
    if [[ $1 = "docker" ]]; then path=./; fi
    cd $path || exit 1

    if [[ $2 = "-v" ]]; then
      git describe --tags --abbrev=0
      exit 0
    fi

    if [[ -f "$path/version" ]]; then
      echo $2 > version
      git add .
      git commit -m "Version changed"
    fi

    GIT_MERGE_AUTOEDIT=no

    git flow release start $2 || exit 1
    git flow release finish $2 -F -p -m

    exit 0
  fi
done
