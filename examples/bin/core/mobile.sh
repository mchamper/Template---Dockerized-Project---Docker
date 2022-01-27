#!/bin/bash

. .env
CMD=$1; ARG1=$2; ARG2=$3; ARG3=$4; ARG4=$5; ARG5=$6;

SERVICE=mobile

if [[ $CMD = "-v" ]]; then
  if [[ $ARG1 != "" ]]; then
    bash base/bin/git/release.sh $SERVICE "$ARG1"; else
    bash base/bin/git/version.sh $SERVICE; fi

  exit
fi

if [[ $CMD = "clone" ]]; then
  bash base/bin/git/clone.sh $SERVICE "git@github.com:project-name/project-name.git" develop --flow || exit 1
  exit
fi

##############################

if [[ $CMD = "build" ]]; then
  PLATFORM=$ARG1

  bash base/bin/docker/run.sh $SERVICE "ionic cap build $PLATFORM --prod --no-open"
  exit
fi

##############################

WSL_HOST_PATH="$WSL_HOST_PATH/from-WSL---$COMPOSE_PROJECT_NAME-$SERVICE"

if [[ $CMD = "wsl-copy-to-host" ]]; then
  bash $0 remove-from-host
  bash base/bin/sources/copy-to.sh $SERVICE "$WSL_HOST_PATH"
  exit
fi

if [[ $CMD = "wsl-remove-from-host" ]]; then
  bash base/bin/sources/remove-from.sh "$WSL_HOST_PATH"
  exit
fi
