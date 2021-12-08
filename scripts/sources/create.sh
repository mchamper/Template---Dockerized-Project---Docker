#!/bin/bash

. ../.env

IFS=';' read -a sources <<< $SRCS

for src in "${sources[@]}"; do
  service=${src%%:*}
  path=${src##*:}

  if [ ! -d ".$path" ]; then
    mkdir -p .$path
  fi
done
