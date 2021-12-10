#!/bin/bash

. ../../.env

IFS=';' read -a sources <<< $SRCS

for src in "${sources[@]}"; do
  service=${src%%:*}
  path="../.${src##*:}"

  if [[ $1 = $service ]]; then
    if [ ! -d "$path" ]; then
      cd $path
      bash -c "$2" || exit 1
    else
      echo "Path not exists in \"$path\""
    fi

    exit 0
  fi
done
