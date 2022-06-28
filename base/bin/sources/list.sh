#!/bin/bash

. .env || exit 1

SERVICE=${1}

function list() {
  local source=${1}

  if [[ -d ${source} ]]; then
    echo "Source: \"${source}\""
  else
    echo "Directory \"${source}\" not found"
  fi
}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} || ${SERVICE} = "--all" ]]; then list ${SRC_SOURCE}; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done
