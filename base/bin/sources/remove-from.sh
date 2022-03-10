#!/bin/bash

. .env || exit 1

TARGET=${1}

if [[ ${TARGET} = "" ]]; then
  exit
fi

mkdir -p .tmp && rsync -a --delete .tmp/ ${TARGET}/ && rm -rf .tmp ${TARGET}
echo "Removed from \"$TARGET\""
