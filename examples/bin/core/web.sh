#!/bin/bash

SERVICE="web"
GIT_URL="git@github.com:project-name/project-name.git"
GIT_BRANCH="develop"
GIT_FLOW=true

SSH_FILE="/home/node/.ssh/some-key.openssh.ppk"
SSH_USER="root@0.0.0.0"
SSH_PORT="22"

. bin/core/__base.sh

##############################

if [[ ${CMD} = "upload" ]]; then
  bash base/bin/aws/s3-upload.sh ${SERVICE} "dist" "bucket-name" --delete
  bash base/bin/aws/cloudfront-invalidate.sh ${SERVICE} "distribution-id"

  exit
fi

if [[ ${CMD} = "download" ]]; then
  bash base/bin/aws/s3-download.sh ${SERVICE} "bucket-name" "dist"
  exit
fi

if [[ ${CMD} = "deploy" ]]; then
  bash ${THIS} upload
  exit
fi
