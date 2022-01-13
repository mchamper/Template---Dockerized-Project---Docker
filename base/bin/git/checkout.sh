#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env
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

  exit
fi

if [[ $CMD = "--exec" ]]; then
  SOURCE=$ARG1
  GIT_BRANCH=$ARG2

  cd $SOURCE || exit 1
  git checkout $GIT_BRANCH

  exit
fi


