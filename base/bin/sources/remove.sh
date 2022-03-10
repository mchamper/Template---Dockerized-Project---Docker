#!/bin/bash

. .env || exit 1

SERVICE=${1}

function remove() {
  local source=${1}

  mkdir -p .tmp && rsync -a --delete .tmp/ ${source}/ && rm -rf .tmp ${source}
  echo "Removed \"${source}\""
}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} || ${SERVICE} = "--all" ]]; then remove ${SRC_SOURCE}; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done
