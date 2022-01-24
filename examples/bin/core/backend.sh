#!/bin/bash

. .env
CMD=$1; ARG1=$2; ARG2=$3; ARG3=$4; ARG4=$5; ARG5=$6;

SERVICE=backend-php

if [[ $CMD = "-v" ]]; then
  if [[ $ARG1 != "" ]]; then
    bash base/bin/git/release.sh $SERVICE "$ARG1"; else
    bash base/bin/git/version.sh $SERVICE; fi

  exit
fi

if [[ $CMD = "clone" ]]; then
  bash base/bin/git/clone.sh $SERVICE "git@github.com:project-name/project-name.git" develop --flow || exit 1
  exit
fi

##############################

if [[ $CMD = "status" ]]; then
  bash base/bin/aws/eb-status.sh $SERVICE
  exit
fi

if [[ $CMD = "ssh" ]]; then
  bash base/bin/aws/eb-ssh.sh $SERVICE
  exit
fi

if [[ $CMD = "deploy" ]]; then
  bash base/bin/aws/eb-deploy.sh $SERVICE production
  exit
fi

if [[ $CMD = "deploy-and-migrate" ]]; then
  bash base/bin/aws/eb-deploy.sh $SERVICE production || exit 1

  bash base/bin/aws/eb-ssh.sh $SERVICE "
    cd /var/app/current;
    php artisan migrate --force;
  "

  exit
fi

if [[ $CMD = "get-envs" ]]; then
  bash base/bin/aws/eb-printenv.sh $SERVICE
  exit
fi

if [[ $CMD = "set-envs" ]]; then
  bash base/bin/aws/eb-setenv.sh $SERVICE "environments/aws/eb/.projectname-backend-production.env"
  exit
fi
