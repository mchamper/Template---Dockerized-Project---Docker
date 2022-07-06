#!/bin/bash

. .env || exit 1

SERVICE=${1}
DOCKER_SOURCE=$(pwd)

function init() {
  local source=${1}

  cd "${DOCKER_SOURCE}"
  cd "${source}" || exit 1

  if [[ -d .git ]]; then
    echo "Git repository already initialized in \"${source}\""
    exit
  fi

  git init || exit 1
  git config user.name "${GIT_USER_NAME}"
  git config user.email "${GIT_USER_EMAIL}"
  git add .
  git commit -m "Initial commit"

  echo "Git repository initialized in \"${source}\""
}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} || ${SERVICE} = "--all" ]]; then init "${SRC_SOURCE}"; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done

if [[ ${SERVICE} = "docker" || ${SERVICE} = "--all" ]]; then init "${DOCKER_SOURCE}"; fi
