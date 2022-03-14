#!/bin/bash

. .env || exit 1

bash base/bin/docker/start.sh

if [[ ${MUTAGEN} = 1 ]]; then
  bash base/bin/mutagen/create.sh web "${SRC_WEB}" /home/node/app node
  bash base/bin/mutagen/create.sh mobile "${SRC_MOBILE}" /home/node/app node
  bash base/bin/mutagen/create.sh backoffice "${SRC_BACKOFFICE}" /home/node/app node
  bash base/bin/mutagen/create.sh backend "${SRC_BACKEND}" /var/www/html
  bash base/bin/mutagen/create.sh backend-php "${SRC_BACKEND}" /var/www/html docker

  bash base/bin/mutagen/monitor.sh
fi
