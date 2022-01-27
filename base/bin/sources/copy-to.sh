#!/bin/bash

. .env || exit 1
CMD=$1; ARG1=$2; ARG2=$3; ARG3=$4; ARG4=$5; ARG5=$6;

if [[ $CMD != "--exec" ]]; then
  for SRC in ${SRCS[@]}; do
    SERVICE=${SRC%%:*}
    SOURCE=${SRC##*:}

    if [[ $1 = $SERVICE ]]; then
      bash $0 --exec "$SOURCE" "$2"
    fi

    if [[ $1 = $SERVICE ]]; then exit; fi
  done

  exit
fi

if [[ $CMD = "--exec" ]]; then
  SOURCE=$ARG1
  TARGET=$ARG2

  cd "$SOURCE" && tar cf - . | (mkdir -p "$TARGET" && cd "$TARGET" && tar xf -) || exit 1
  echo "Copied from \"$SOURCE\" to \"$TARGET\""

  exit
fi
