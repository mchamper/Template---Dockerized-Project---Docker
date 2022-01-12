#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env
CMD=$1; ARG1=$2; ARG2=$3; ARG3=$4; ARG4=$5; ARG5=$6;

SERVICE=$CMD

VERSION=$(bash base/bin/git/version.sh $SERVICE)
VERSION_FULL=$(bash base/bin/git/version.sh $SERVICE --full)
LABEL="$COMPOSE_PROJECT_NAME-$SERVICE-$VERSION_FULL"

if [[ $ARG1 = "-v" ]]; then
  echo $VERSION \($VERSION_FULL\)
else
  bash base/bin/docker/run.sh $SERVICE "eb deploy -l \"$LABEL\""
fi

