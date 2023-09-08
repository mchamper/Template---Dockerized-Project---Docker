#!/bin/bash

. .env || exit 1

SERVICE=${1}
DOCKER_SOURCE=$(pwd)

function branch() {
  local source=${1}
  local commit=${2}

  cd "${source}"
  echo "$(git branch --show-current)"
}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then branch "${SRC_SOURCE}" ; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done

if [[ ${SERVICE} = "docker" ]]; then branch "${DOCKER_SOURCE}"; fi
