#!/bin/bash

. .env || exit 1

SERVICE=${1}
COMMIT=${2}

function sync() {
  local source=${1}
  local commit=${2}

  cd "${source}"
  local current_branch=$(git branch --show-current)

  git checkout develop && git fetch && git pull
  git checkout ${current_branch} && git fetch && git pull

  git merge develop || exit 1

  if [[ ${commit} = "--commit" ]]; then
    git push
  fi
}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then sync "${SRC_SOURCE}" ${COMMIT}; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done
