#!/bin/bash

. .env || exit 1

SERVICE=${1}

bash base/bin/docker/run.sh ${SERVICE} "
  npx create-react-app ./;
  rm -rf ./.git
"

bash base/bin/git/init.sh ${SERVICE}
