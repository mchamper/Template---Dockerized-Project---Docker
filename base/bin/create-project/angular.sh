#!/bin/bash

. .env || exit 1

SERVICE=${1}
PACKAGE_MANAGER=${2:-"yarn"}

bash base/bin/docker/run.sh ${SERVICE} "
  ng new app --directory ./ --package-manager ${PACKAGE_MANAGER} --skip-git;
"

bash base/bin/git/init.sh ${SERVICE}
