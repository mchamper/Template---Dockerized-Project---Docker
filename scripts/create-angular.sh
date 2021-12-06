#!/bin/bash

source ../.env

bash run.sh $1 "
    git config user.name \"${GIT_USER_NAME}\";
    git config user.email \"${GIT_USER_EMAIL}\";
    ng new app --directory ./ --package-manager yarn --commit;
"