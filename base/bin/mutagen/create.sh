#!/bin/bash

. .env || exit 1

SERVICE=${1}
SOURCE=${2}
TARGET=${3}
BETA_USER=${4:-"root"}
DOCKER_USER=${5:-"root"}

mutagen sync create \
  --name=${SERVICE} \
  --label project="${COMPOSE_PROJECT_NAME}" \
  --sync-mode=two-way-resolved \
  --default-owner-beta=${BETA_USER} \
  --default-group-beta=${BETA_USER} \
  --probe-mode=assume \
  --symlink-mode=posix-raw \
  --ignore-vcs \
  "${SOURCE}" docker://${DOCKER_USER}@${COMPOSE_PROJECT_NAME}_${SERVICE}_1${TARGET}

  # --ignore ./config,./docker,./frontend-build,./Jenkins,*.sql,*.tar.gz \
