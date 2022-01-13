#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env
CMD=$1; ARG1=$2; ARG2=$3; ARG3=$4; ARG4=$5; ARG5=$6;

if [[ $CMD != "--exec" ]]; then
  for SRC in ${SRCS[@]}; do
    SERVICE=${SRC%%:*}
    SOURCE=${SRC##*:}

    if [[ $1 = $SERVICE ]]; then
      bash $0 --exec "$SOURCE" "$2" "$3" "$4"
      exit
    fi
  done

  exit
fi

if [[ $CMD = "--exec" ]]; then
  SOURCE=$ARG1
  GIT_CLONE_URL=$ARG2
  GIT_BRANCH=$ARG3

  git clone $GIT_CLONE_URL $SOURCE || exit 1
  cd $SOURCE

  git config user.name "$GIT_USER_NAME"
  git config user.email "$GIT_USER_EMAIL"

  if [[ $GIT_BRANCH != "" ]]; then
    git checkout $GIT_BRANCH
  fi

  if [[ $ARG4 = "--flow" ]]; then
    git flow init -d
  fi

  exit
fi

