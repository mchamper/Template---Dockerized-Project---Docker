#!/bin/bash

. .env || exit 1

SERVICE=${1}
DOCKER_SOURCE=$(pwd)

function pull() {
  local source=${1}

  cd "${DOCKER_SOURCE}"
  cd "${source}" || exit 1

  if [[ -d .git ]]; then
    local current_branch=$(git branch --show-current)

    for BRANCH in $(git branch | sed 's/^\*//'); do
      git checkout ${BRANCH}
      git fetch
      git pull
    done

    git checkout ${current_branch}

    echo "Git reposirory pulled in \"${source}\""
  else
    echo "No git repository in \"${source}\""
  fi
}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} || ${SERVICE} = "--all" ]]; then pull "${SRC_SOURCE}"; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done

if [[ ${SERVICE} = "docker" || ${SERVICE} = "--all" ]]; then pull "${DOCKER_SOURCE}"; fi
