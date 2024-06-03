#!/bin/bash

SERVICE="backend"
GIT_URL="git@github.com:project-name/project-name.git"
GIT_BRANCH="develop"
GIT_FLOW=true

. bin/core/__base.sh

##############################

if [[ ${CMD} = "install" ]]; then
  bash ${THIS} run "
    composer install
    cp -n .env.example .env
    php artisan key:generate
    php artisan storage:link
  "

  exit
fi

if [[ ${CMD} = "status" ]]; then
  bash base/bin/aws/eb-status.sh ${SERVICE}
  exit
fi

if [[ ${CMD} = "deploy" ]]; then
  bash base/bin/aws/eb-deploy.sh ${SERVICE}
  exit
fi

if [[ ${CMD} = "deploy-and-migrate" ]]; then
  bash ${THIS} deploy && bash ${THIS} eb-ssh "
    cd /var/app/current
    php artisan migrate --force
  "

  exit
fi

if [[ ${CMD} = "get-envs" ]]; then
  bash base/bin/aws/s3-getenvs.sh 0-utils "aws-projectname-environments/${SERVICE}-prod/.env" "environments/${SERVICE}-prod/.env[REMOTE]"
  exit
fi

if [[ ${CMD} = "set-envs" ]]; then
  bash base/bin/aws/s3-setenvs.sh 0-utils "environments/${SERVICE}-prod/.env" "aws-projectname-environments/${SERVICE}-prod/.env"
  exit
fi

if [[ ${CMD} = "logs" ]]; then
  echo "$(bash ${THIS} eb-ssh "cat /var/log/eb-engine.log")" > "logs/${SERVICE}-prod--aws-eb-engine.log"
  # echo "$(bash ${THIS} eb-ssh "cat /var/log/cfn-init.log")" > "logs/${SERVICE}-prod--aws-cfn-init.log"
  # echo "$(bash ${THIS} eb-ssh "cat /var/log/cfn-init-cmd.log")" > "logs/${SERVICE}-prod--aws-cfn-init-cmd.log"
  echo "$(bash ${THIS} eb-ssh "cat /var/app/current/storage/logs/laravel.log")" > "logs/${SERVICE}-prod--laravel.log"

  exit
fi
