#!/bin/bash

source ../.env

bash run.sh $1 "
    git config user.name \"${GIT_USER_NAME}\";
    git config user.email \"${GIT_USER_EMAIL}\";
    composer create-project --prefer-dist laravel/laravel ./;
    git init;
    git add .;
    git commit -m \"Initial commit\";
"