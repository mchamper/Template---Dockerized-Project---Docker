#!/bin/bash

. ../../.env

bash docker/run.sh $1 "
  git config --global user.name \"${GIT_USER_NAME}\";
  git config --global user.email \"${GIT_USER_EMAIL}\";
  ng new app --directory ./ --package-manager yarn --commit;
"