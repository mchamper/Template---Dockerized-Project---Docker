#!/bin/bash

. .env || exit 1

SERVICE=${1}

bash base/bin/docker/run.sh ${SERVICE} "
  composer create-project --prefer-dist laravel/laravel ./;
"

bash base/bin/git/init.sh ${SERVICE}
