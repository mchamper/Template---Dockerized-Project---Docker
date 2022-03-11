#!/bin/bash

. .env || exit 1

SERVICE=${1}

bash base/bin/docker/start.sh ${SERVICE}

if [[ ${MUTAGEN} = 1 ]]; then
  if [[ ${SERVICE} = "" || ${SERVICE} = "web" ]]; then bash base/bin/mutagen/create.sh web "${SRC_WEB}" /home/node/app node; fi
  if [[ ${SERVICE} = "" || ${SERVICE} = "mobile" ]]; then bash base/bin/mutagen/create.sh mobile "${SRC_MOBILE}" /home/node/app node; fi
  if [[ ${SERVICE} = "" || ${SERVICE} = "backoffice" ]]; then bash base/bin/mutagen/create.sh backoffice "${SRC_BACKOFFICE}" /home/node/app node; fi
  if [[ ${SERVICE} = "" || ${SERVICE} = "backend" ]]; then bash base/bin/mutagen/create.sh backend "${SRC_BACKEND}" /var/www/html; fi
  if [[ ${SERVICE} = "" || ${SERVICE} = "backend-php" ]]; then bash base/bin/mutagen/create.sh backend-php "${SRC_BACKEND}" /var/www/html docker; fi

  bash base/bin/mutagen/monitor.sh
fi
