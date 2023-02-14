#!/bin/bash

. .env || exit 1

FRAMEWORK=${1}
SERVICE=${2}

DIR=$(dirname ${0})
SOURCE="${DIR}/${FRAMEWORK}/src"
TARGET=$(bash base/bin/sources/get.sh ${SERVICE})

bash ${DIR}/${FRAMEWORK}/script.sh ${SERVICE}

for FILE in $(find ${SOURCE} -type f); do
  SOURCE_FILE=${FILE}
  TARGET_FILE=${TARGET}/${FILE#${SOURCE}\/}
  FILE=${FILE#${SOURCE}\/}

  if [[ -f ${TARGET_FILE} ]]; then
    mv ${TARGET_FILE} ${TARGET_FILE}.original
  fi

  rsync -a --mkpath --ignore-existing ${SOURCE_FILE} ${TARGET_FILE}
done
