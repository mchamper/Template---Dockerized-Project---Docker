#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi
. .env

for src in "${SRCS[@]}"; do
  service=${src%%:*}
  path="${src##*:}"

  rm -rf $path
  echo "Removed \"$path\""
done
