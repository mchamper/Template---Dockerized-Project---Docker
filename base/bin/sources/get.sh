#!/bin/bash

. .env || exit 1

SERVICE=${1}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then echo "${SRC_SOURCE}"; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done
