#!/bin/bash

. .env || exit 1

SERVICE=${1}
FRAMEWORK=${2}
KEEP_ORIGINALS=${3}

DIR=$(dirname ${0})
SOURCE="${DIR}/${FRAMEWORK}/src"
TARGET=$(bash base/bin/sources/get.sh ${SERVICE})

if [[ ${TARGET} = "" ]]; then exit 1; fi;

bash ${DIR}/${FRAMEWORK}/script.sh ${SERVICE}

for FILE in $(find ${SOURCE} -type f); do
  SOURCE_FILE=${FILE}
  TARGET_FILE=${TARGET}/${FILE#${SOURCE}\/}
  FILE=${FILE#${SOURCE}\/}

  if [[ ${KEEP_ORIGINALS} = "--keep" ]]; then
    if [[ -f ${TARGET_FILE} ]]; then
      mv ${TARGET_FILE} ${TARGET_FILE}.original
    fi
  fi

  rsync -a --mkpath ${SOURCE_FILE} ${TARGET_FILE}
done
