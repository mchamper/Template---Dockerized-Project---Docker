#!/bin/bash

. .env

bash base/bin/docker/run.sh $1 "
  ng new app --directory ./ --package-manager yarn --skip-git;
"

bash base/bin/git/init.sh $1