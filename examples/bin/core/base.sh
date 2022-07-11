#!/bin/bash

. .env || exit 1

CMD=${1}; ARG1=${2}; ARG2=${3}; ARG3=${4}; ARG4=${5}; ARG5=${6};

if [[ ${CMD} = "-v" ]]; then
  VERSION=${ARG1}

  if [[ ${VERSION} != "" ]]; then
    bash base/bin/git/release.sh ${SERVICE} "${VERSION}"; else
    bash base/bin/git/version.sh ${SERVICE}; fi

  exit
fi
