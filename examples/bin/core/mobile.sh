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
  PLATFORM=${ARG1}

  bash ${THIS} npm-install
  bash ${THIS} run "ionic cap build ${PLATFORM} --prod --no-open"

  if [[ ${PLATFORM} = "ios" ]]; then
    cd ../mobile/ios/App
    pod install
    open -a Xcode App.xcworkspace

    exit
  fi

  exit
fi
