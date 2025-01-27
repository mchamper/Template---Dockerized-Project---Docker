#!/bin/bash

if [[ ${1} = "beta" ]]; then
  BRANCH="develop"
fi

if [[ ${1} = "prod" ]]; then
  BRANCH="master"
fi

cd ../../docker

cd ../webapp && git restore . && git switch ${BRANCH} && git pull
cd ../backoffice && git restore . && git switch ${BRANCH} && git pull
cd ../backend && git restore . && git switch ${BRANCH} && git pull
