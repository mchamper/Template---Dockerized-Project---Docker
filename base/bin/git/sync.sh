#!/bin/bash

. .env || exit 1

SERVICE=${1}
COMMIT=${2}

function sync() {
  local source=${1}
  local commit=${2}

  cd "${source}"
  git merge develop || exit 1

  if [[ ${commit} = "--commit" ]]; then
    git push --all
  fi
}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then sync "${SRC_SOURCE}" ${COMMIT}; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done
