#!/bin/bash

. .env || exit 1

SERVICE=${1}
COMMIT=${2}

function publish() {
  local source=${1}
  local commit=${2}

  cd "${source}"
  local current_branch=$(git branch --show-current)

  git merge develop || exit 1
  git checkout develop
  git merge ${current_branch} || exit 1
  git checkout ${current_branch}

  if [[ ${commit} = "--commit" ]]; then
    git push --all
  fi
}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then publish "${SRC_SOURCE}" ${COMMIT}; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done
