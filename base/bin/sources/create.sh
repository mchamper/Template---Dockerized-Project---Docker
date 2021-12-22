#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi
. .env

for src in "${SRCS[@]}"; do
  service=${src%%:*}
  path="${src##*:}"

  if [ ! -d $path ]; then
    mkdir -p $path
    echo "Created \"$path\""
  elif [[ $1 = "--check-exists" ]]; then
    echo "Directory already exists"; exit 1
  fi
done
