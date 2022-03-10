#!/bin/bash

. .env || exit 1

SERVICE=${1}
DOCKER_SOURCE=$(pwd)

function version() {
  local source=${1}

  cd "${DOCKER_SOURCE}"
  cd "${source}" || exit 1

  if [[ -d .git ]]; then
    local version=$(git describe --tags --abbrev=0)
    local version_full=$(git describe --tags)

    if [[ ${2} = "--full" ]]; then
      echo $version_full
    else
      echo $version
    fi
  else
    echo "No git repository in \"${source}\""
  fi
}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then version "${SRC_SOURCE}" ${2}; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done

if [[ ${SERVICE} = "docker" ]]; then version "${DOCKER_SOURCE}" ${2}; fi
