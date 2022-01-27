#!/bin/bash

. .env || exit 1
CMD=$1; ARG1=$2; ARG2=$3; ARG3=$4; ARG4=$5; ARG5=$6;

if [[ $CMD != "--exec" ]]; then
  for SRC in ${SRCS[@]}; do
    SERVICE=${SRC%%:*}
    SOURCE=${SRC##*:}

    if [[ $1 = "--all" || $1 = $SERVICE ]]; then
      bash $0 --exec "$SOURCE"
    fi

    if [[ $1 = $SERVICE ]]; then exit; fi
  done

  exit
fi

if [[ $CMD = "--exec" ]]; then
  SOURCE=$ARG1

  if [ ! -d $SOURCE ]; then
    mkdir -p $SOURCE
    echo "Created \"$SOURCE\""
  else
    echo "Directory \"$SOURCE\" already exists"
  fi

  exit
fi
