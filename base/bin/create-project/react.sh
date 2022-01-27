#!/bin/bash

. .env || exit 1

bash base/bin/docker/run.sh $1 "
  npx create-react-app ./;
  rm -rf ./.git
"

bash base/bin/git/init.sh $1
