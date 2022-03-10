#!/bin/bash

. .env || exit 1

SERVICE=${1}

function create() {
  local source=${1}

  if [[ ! -d ${source} ]]; then
    mkdir -p ${source}
    echo "Created \"${source}\""
  else
    echo "Directory \"${source}\" already exists"
  fi
}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} || ${SERVICE} = "--all" ]]; then create ${SRC_SOURCE}; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done
