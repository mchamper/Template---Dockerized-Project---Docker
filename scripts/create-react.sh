#!/bin/bash

source ../.env

bash run.sh $1 "
    git config user.name \"${GIT_USER_NAME}\";
    git config user.email \"${GIT_USER_EMAIL}\";
    npx create-react-app ./;
"