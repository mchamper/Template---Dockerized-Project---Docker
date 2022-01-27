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
  VERSION=$ARG2

  cd $SOURCE || exit 1

  if [[ $ARG2 = "-v" ]]; then
    git describe --tags --abbrev=0
    exit
  fi

  if [[ $VERSION = "" ]]; then
    exit
  fi

  if [[ -f package.json && ! -f composer.json ]]; then
    sed -i '0,/version/ s|\(.*"version"\): "\(.*\)",.*|\1: '"\"$VERSION\",|" package.json;

    if [[ -f package-lock.json ]]; then
      sed -i '0,/version/ s|\(.*"version"\): "\(.*\)",.*|\1: '"\"$VERSION\",|" package-lock.json;
    fi

    echo "export const version = \"$VERSION\";" > version.js
  else
    echo $VERSION > version.txt
  fi

  git add .
  git commit -m "Auto commit: Version changed"
  git flow release start $VERSION || exit 1
  git flow release finish $VERSION -F -p -m "Auto release:"

  exit
fi
