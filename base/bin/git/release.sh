#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env
CMD=$1; ARG1=$2; ARG2=$3; ARG3=$4; ARG4=$5; $ARG5=$6

if [[ $CMD != "--exec" ]]; then
  for SRC in "${SRCS[@]}"; do
    SERVICE=${SRC%%:*}
    SOURCE="${SRC##*:}"

    if [[ $CMD = $SERVICE ]]; then
      bash $0 --exec "$SOURCE" "$ARG1"
      exit
    fi
  done

  if [[ $CMD = "docker" ]]; then
    bash $0 --exec ./../docker "$ARG1"
  fi

  exit
fi

if [[ $CMD = "--exec" ]]; then
  SOURCE=$ARG1
  VERSION=$ARG2

  cd $SOURCE || exit 1

  if [[ $ARG2 = "-v" ]]; then
    git describe --tags --abbrev=0
    exit
  fi

  echo $VERSION > version

  git add .
  git commit -m "Auto commit: Version changed"
  git flow release start $VERSION || exit 1
  git flow release finish $VERSION -F -p -m "Auto release:"

  exit
fi


