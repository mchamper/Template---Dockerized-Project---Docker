#!/bin/bash

. .env || exit 1

SERVICE=${1}
VERSION=${2}
DOCKER_SOURCE=$(pwd)

function release() {
  local source=${1}
  local version=${2}

  cd "${DOCKER_SOURCE}"
  cd "${source}" || exit 1

  if [[ -d .git ]]; then
    if [[ ${version} = "" ]]; then
      exit
    fi

    if [[ ${version} = "-v" ]]; then
      git describe --tags --abbrev=0
      exit
    fi

    if [[ -f package.json && ! -f composer.json ]]; then
      sed -i '0,/version/ s|\(.*"version"\): "\(.*\)",.*|\1: '"\"${version}\",|" package.json;

      if [[ -f package-lock.json ]]; then
        sed -i '0,/version/ s|\(.*"version"\): "\(.*\)",.*|\1: '"\"${version}\",|" package-lock.json;
      fi

      echo "export const version = \"${version}\";" > version.js
    else
      echo ${version} > version.txt
    fi

    git add .
    git commit -m "Auto commit: Version changed"
    git flow release start ${version} || exit 1
    git flow release finish ${version} -F -p -m "Auto release:"
  else
    echo "No git repository in \"${source}\""
  fi
}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then release "${SRC_SOURCE}" ${VERSION}; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done

if [[ ${SERVICE} = "docker" ]]; then release "${DOCKER_SOURCE}" ${VERSION}; fi
