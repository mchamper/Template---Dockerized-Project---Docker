#!/bin/bash

. .env || exit 1
CMD=$1; ARG1=$2; ARG2=$3; ARG3=$4; ARG4=$5; ARG5=$6;

TARGET=$1

if [[ $TARGET = "" ]]; then
  exit
fi

mkdir -p .tmp && rsync -a --delete .tmp/ $TARGET/ && rm -rf .tmp $TARGET
echo "Removed from \"$TARGET\""
