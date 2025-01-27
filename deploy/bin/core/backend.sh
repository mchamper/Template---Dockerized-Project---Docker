#!/bin/bash

if [[ ${1} = "truncate" ]]; then
  docker-compose -f docker-compose.${2}.yml run --rm backend-${2} /bin/sh -c "
    php artisan db:wipe --force
  "

  exit
fi

if [[ ${1} = "install" ]]; then
  bash ${0} truncate ${2}

  docker-compose -f docker-compose.${2}.yml run --rm backend-${2} /bin/sh -c "
    php artisan migrate --force --seed
    php artisan app:generate-admin-users
  "

  exit
fi

if [[ ${1} = "update" ]]; then
  docker-compose -f docker-compose.${2}.yml run --rm backend-${2} /bin/sh -c "
    php artisan migrate --force --seed
  "

  exit
fi
