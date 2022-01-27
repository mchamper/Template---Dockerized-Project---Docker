#!/bin/bash

. .env || exit 1
CMD=$1; ARG1=$2; ARG2=$3; ARG3=$4; ARG4=$5; ARG5=$6;

if [[ $CMD != "--exec" ]]; then
  for SRC in ${SRCS[@]}; do
    SERVICE=${SRC%%:*}
    SOURCE=${SRC##*:}

    if [[ $1 = $SERVICE ]]; then
      bash $0 --exec "$SOURCE" "$2"
      exit
    fi
  done

  if [[ $CMD = "docker" ]]; then
    bash $0 --exec ./../docker "$2"
  fi

  exit
fi

if [[ $CMD = "--exec" ]]; then
  SOURCE=$ARG1
  cd $SOURCE || exit 1

  VERSION=$(git describe --tags --abbrev=0) || exit
  VERSION_FULL=$(git describe --tags) || exit

  if [[ $ARG2 = "--full" ]]; then
    echo $VERSION_FULL
  else
    echo $VERSION
  fi

  exit
fi

