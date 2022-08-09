#!/bin/bash

SERVICE="backend-php"
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
    php artisan jwt:secret
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
  bash ${THIS} deploy && bash ${THIS} ssh "
    cd /var/app/current
    php artisan migrate --force
  "

  exit
fi

if [[ ${CMD} = "get-envs" ]]; then
  if [[ ${ARG1} = "--backup" ]]; then
    echo $(bash base/bin/aws/eb-printenv.sh ${SERVICE}) > "environments/aws/eb/.projectname-backend-production.backup.env"
    exit
  fi

  bash base/bin/aws/eb-printenv.sh ${SERVICE}
  exit
fi

if [[ ${CMD} = "set-envs" ]]; then
  bash base/bin/aws/eb-setenv.sh ${SERVICE} "environments/aws/eb/.projectname-backend-production.env"
  bash ${THIS} deploy

  exit
fi

if [[ ${CMD} = "logs" ]]; then
  # echo $(bash ${THIS} eb-ssh "cat /var/log/eb-engine.log") > "logs/${SERVICE}--prod--eb-engine.log"
  # echo $(bash ${THIS} eb-ssh "cat /var/log/cfn-init.log") > "logs/${SERVICE}--prod--cfn-init.log"
  echo $(bash ${THIS} eb-ssh "cat /var/app/current/storage/logs/laravel.log") > "logs/${SERVICE}--prod--laravel.log"

  exit
fi
