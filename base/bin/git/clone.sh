#!/bin/bash

. .env || exit 1

SERVICE=${1}
GIT_URL=${2}
GIT_BRANCH=${3}
GIT_FLOW=${4}

function clone() {
  local source=${1}
  local git_url=${2}
  local git_branch=${3}
  local git_flow=${4}

  git clone ${git_url} ${source} || exit 1
  cd "${source}"

  git config user.name "${GIT_USER_NAME}"
  git config user.email "${GIT_USER_EMAIL}"

  if [[ ${git_branch} != "" ]]; then
    git checkout ${git_branch}
  fi

  if [[ ${git_flow} = "--flow" ]]; then
    git flow init -d
  fi
}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then clone "${SRC_SOURCE}" ${GIT_URL} ${GIT_BRANCH} ${GIT_FLOW}; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done
