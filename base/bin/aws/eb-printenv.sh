#!/bin/bash

. .env || exit 1

SERVICE=${1}

bash base/bin/docker/run.sh 0-aws "
  cd /docker/src/${SERVICE} || exit 1
  eb printenv
"
