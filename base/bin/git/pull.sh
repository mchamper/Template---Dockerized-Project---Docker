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

  if [[ $1 = "--all" || $1 = "docker" ]]; then
    bash $0 --exec ./../docker
  fi

  exit
fi

if [[ $CMD = "--exec" ]]; then
  SOURCE=$ARG1
  cd $SOURCE || exit 1

  if [[ -d .git ]]; then
    git pull --all
    echo "Git reposirory pulled in \"$SOURCE\""
  else
    echo "No git repository in \"$SOURCE\""
  fi

  exit
fi
