#!/bin/bash

. .env

for src in "${SRCS[@]}"; do
  service=${src%%:*}
  path="${src##*:}"

  if [[ $1 = $service || $1 = "docker" ]]; then
    if [[ $1 = "docker" ]]; then path=./; fi
    cd $path || exit 1
    cat version

    # if [[ -f "$path/version" ]]; then
    #   echo $1 > version
    #   git add .
    #   git commit -m "Version changed"
    # fi

    # git flow release start $2
    # git flow release finish $2 -F -m $2 -p

    exit 0
  fi
done
