#!/bin/bash

. .env

bash base/bin/docker/run.sh $1 "
  composer create-project --prefer-dist laravel/laravel ./;
"

bash base/bin/git/init.sh $1