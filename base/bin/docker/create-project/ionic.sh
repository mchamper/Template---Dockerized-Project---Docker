#!/bin/bash

. .env

bash base/bin/docker/run.sh $1 "
  ionic config set -g npmClient yarn;
  ionic start app --no-git;
  cp -rf ./app ../;
  rm -rf ./app;
"

bash base/bin/git/init.sh $1
