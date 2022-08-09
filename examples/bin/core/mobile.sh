#!/bin/bash

SERVICE="mobile"
GIT_URL="git@github.com:project-name/project-name.git"
GIT_BRANCH="develop"
GIT_FLOW=true

. bin/core/__base.sh

##############################

if [[ ${CMD} = "install" ]]; then
  bash ${THIS} npm-install
  exit
fi

if [[ ${CMD} = "build" ]]; then
  bash ${THIS} npm-build
  exit
fi

##############################
########### NATIVE ###########
##############################

function nativePrepare() {
  . base/bin/nvm/use.sh
  nvm install 16 && nvm use 16
  npm i -g npm@7
  npm i -g @angular/cli@12

  cd "${SRC_MOBILE}"
}

if [[ ${CMD} = "na-start" ]]; then
  nativePrepare

  npm run start -- --host 0.0.0.0 --port 10004
  exit
fi

if [[ ${CMD} = "na-install" ]]; then
  nativePrepare

  npm install
  exit
fi

if [[ ${CMD} = "na-build" ]]; then
  nativePrepare

  npm install && npm run build
  exit
fi
