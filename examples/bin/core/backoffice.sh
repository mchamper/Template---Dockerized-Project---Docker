#!/bin/bash

SERVICE="backoffice"
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

if [[ ${CMD} = "upload" ]]; then
  bash base/bin/aws/s3-upload.sh ${SERVICE} "dist/app" "bucket-name" --delete
  bash base/bin/aws/cloudfront-invalidate.sh ${SERVICE} "distribution-id"

  exit
fi

if [[ ${CMD} = "deploy" ]]; then
  bash ${THIS} build && bash ${THIS} upload
  exit
fi
