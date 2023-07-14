#!/bin/bash

. .env || exit 1

bash base/bin/sources/create.sh --all || exit 1

########################################

bash bin/core/website.sh clone
bash bin/core/webapp.sh clone
bash bin/core/mobile.sh clone
bash bin/core/backoffice.sh clone
bash bin/core/backend.sh clone

bash bin/core/website.sh install
bash bin/core/webapp.sh install
bash bin/core/mobile.sh install
bash bin/core/backoffice.sh install
bash bin/core/backend.sh install

if [[ ${1} = "--db-import" ]]; then
  bash start.sh database
  sleep 15

  if [[ ! -f database-exports/dump.sql ]]; then
    bash bin/core/database.sh export-remote
  fi

  bash bin/core/database.sh import
fi
