#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env

SERVICE=$1
VERSION=$(bash base/bin/git/version.sh $SERVICE) || exit 1
VERSION_FULL=$(bash base/bin/git/version.sh $SERVICE --full) || exit 1
LABEL="$COMPOSE_PROJECT_NAME-$SERVICE-$VERSION_FULL"

if [[ $ARG1 = "-v" ]]; then
  echo $VERSION \($VERSION_FULL\)
else
  bash base/bin/docker/run.sh $SERVICE "eb deploy -l \"$LABEL\""
fi

