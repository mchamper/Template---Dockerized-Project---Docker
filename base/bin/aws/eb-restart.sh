#!/bin/bash

. .env || exit 1

SERVICE=${1}

ENVIRONMENT_ID=$(bash base/bin/aws/eb-status.sh ${SERVICE} | grep Environment\ ID) || exit 1
ENVIRONMENT_ID=${ENVIRONMENT_ID##*:}

if [[ ${ENVIRONMENT_ID} != "" ]]; then
  bash base/bin/docker/run.sh 0-aws "
    aws elasticbeanstalk restart-app-server --environment-id ${ENVIRONMENT_ID}
  "

  echo "Environment \"${ENVIRONMENT_ID}\" is restarting."
else
  echo "Environment ID not found."
fi
