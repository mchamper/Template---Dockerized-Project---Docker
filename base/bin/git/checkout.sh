#!/bin/bash

. .env || exit 1

SERVICE=${1}
BRANCH=${2}
DOCKER_SOURCE=$(pwd)

function checkout() {
  local source=${1}
  local branch=${2}

  cd "${source}"
  git checkout ${branch}
}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then checkout "${SRC_SOURCE}" "${BRANCH}"; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done
