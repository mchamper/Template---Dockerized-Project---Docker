#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env
CMD=$1; ARG1=$2; ARG2=$3; ARG3=$4; ARG4=$5; ARG5=$6;

bash base/bin/docker/run.sh $1 "
  npx create-react-app ./;
  rm -rf ./.git
"

bash base/bin/git/init.sh $1