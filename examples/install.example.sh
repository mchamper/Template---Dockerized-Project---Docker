#!/bin/bash

bash base/bin/sources/create.sh --all || exit 1
bash base/bin/docker/build.sh || exit 1

########################################

bash bin/core/web.sh clone
bash bin/core/mobile.sh clone
bash bin/core/backoffice.sh clone
bash bin/core/backend.sh clone

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

bash base/bin/docker/start.sh database
sleep 30

bash base/bin/docker/run.sh backend-php "
  php artisan migrate --force --seed;
"

bash base/bin/docker/exec.sh database "
  cd /home/mysql/bin;
  bash export-remote.sh;
  bash import.sh;
"

bash base/bin/docker/run.sh backend-php "
  php artisan tinker --execute \"
    \DB::table('system_users')
      ->where('username', 'root')
      ->update([
        'password' => bcrypt(env('ROOT_PASSWORD', 'root'))
      ])
  \";
"

bash base/bin/docker/down.sh
