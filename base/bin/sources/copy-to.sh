#!/bin/bash

. .env || exit 1

SERVICE=${1}
TARGET=${2}

function copy_to() {
  local source=${1}
  local target=${2}

  cd "${source}" && tar cf - . | (mkdir -p "${target}" && cd "${target}" && tar xf -) || exit 1
  echo "Copied from \"${source}\" to \"${target}\""
}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then copy_to ${SRC_SOURCE} ${TARGET}; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done
