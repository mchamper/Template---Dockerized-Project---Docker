#!/bin/bash

. .env || exit 1

SERVICE=${1}
DOCKER_SOURCE=$(pwd)

function fetch() {
  local source=${1}

  cd "${DOCKER_SOURCE}"
  cd "${source}" || exit 1

  if [[ -d .git ]]; then
    git fetch --all

    echo "Git reposirory fetched in \"${source}\""
  else
    echo "No git repository in \"${source}\""
  fi
}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} || ${SERVICE} = "--all" ]]; then fetch "${SRC_SOURCE}"; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done

if [[ ${SERVICE} = "docker" || ${SERVICE} = "--all" ]]; then fetch "${DOCKER_SOURCE}"; fi
