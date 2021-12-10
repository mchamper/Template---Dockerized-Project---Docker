#!/bin/bash

. ../../.env

IFS=';' read -a sources <<< $SRCS

for src in "${sources[@]}"; do
  service=${src%%:*}
  path="../.${src##*:}"

  rm -rf $path
  echo "Removed \"$path\""
done
