#!/bin/bash

. ../.env

bash run.sh $1 "
  git config --global user.name \"${GIT_USER_NAME}\";
  git config --global user.email \"${GIT_USER_EMAIL}\";
  ionic config set -g npmClient yarn;
  ionic start app;
  cp -rf ./app ../;
  rm -rf ./app;
"
