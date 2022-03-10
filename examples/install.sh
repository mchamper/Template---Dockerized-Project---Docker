#!/bin/bash

. .env || exit 1

bash base/bin/sources/create.sh --all || exit 1
bash base/bin/docker/build.sh || exit 1

########################################

bash bin/core/web.sh clone
bash bin/core/mobile.sh clone
bash bin/core/backoffice.sh clone
bash bin/core/backend.sh clone

if [[ ${MUTAGEN} = 1 ]]; then
  bash start.sh
  sleep ${MUTAGEN_SLEEP}
fi

bash base/bin/docker/run.sh web "
  yarn install;
"

bash base/bin/docker/run.sh mobile "
  yarn install;
"

bash base/bin/docker/run.sh backoffice "
  yarn install;
"

bash base/bin/docker/run.sh backend-php "
  composer install;
  cp .env.example .env;
  php artisan key:generate;
  php artisan jwt:secret;
  php artisan storage:link;
"

if [[ ${MUTAGEN} != 1 ]]; then
  bash start.sh database
  sleep 15
fi

bash base/bin/docker/run.sh backend-php "
  php artisan migrate --force --seed;
"

bash bin/core/database.sh export-remote
bash bin/core/database.sh import

bash stop.sh
