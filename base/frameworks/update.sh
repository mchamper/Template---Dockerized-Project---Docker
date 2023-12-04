#!/bin/bash

. .env || exit 1

SERVICE=${1}
FRAMEWORK=${2}

DIR=$(dirname ${0})
SOURCE="${DIR}/${FRAMEWORK}/src"
TARGET=$(bash base/bin/sources/get.sh ${SERVICE})

case ${FRAMEWORK} in
  "laravel")
    CORE_SOURCE="${SOURCE}/app/Core"
    ;;

  "angular")
    CORE_SOURCE="${SOURCE}/src/app/core"
    ;;
esac

if [[ ${CORE_SOURCE} != "" ]]; then
  for FILE in $(find ${CORE_SOURCE} -type f); do
    SOURCE_FILE=${FILE}
    TARGET_FILE=${TARGET}/${FILE#${SOURCE}\/}
    FILE=${FILE#${SOURCE}\/}

    rsync -a --mkpath --ignore-existing ${SOURCE_FILE} ${TARGET_FILE}
  done
fi
