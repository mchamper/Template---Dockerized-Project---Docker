#!/bin/bash

SERVICE="database"

. bin/core/__base.sh

##############################

if [[ ${CMD} = "truncate" ]]; then
  bash base/bin/docker/run.sh backend "
    php artisan db:wipe --force
  "

  exit
fi

if [[ ${CMD} = "install" ]]; then
  bash ${THIS} truncate

  bash base/bin/docker/run.sh backend "
    php artisan migrate --force --seed
    php artisan app:generate-root
  "

  exit
fi

if [[ ${CMD} = "update" ]]; then
  bash base/bin/docker/run.sh backend "
    php artisan migrate --force --seed
  "

  exit
fi

##############################

if [[ ${CMD} = "add-ip" ]]; then
  IP=${ARG1}
  DESCRIPTION=${ARG2:-${GIT_USER_NAME}}

  bash base/bin/aws/ec2-add-ip.sh backend "security-group-id" "${IP}" "${DESCRIPTION}" 3306
  exit
fi

if [[ ${CMD} = "export-remote" ]]; then
  bash ${THIS} add-ip

  bash base/bin/docker/exec-as.sh database "
    cd /docker/bin
    bash export-remote.sh
  " docker

  exit
fi

if [[ ${CMD} = "import" ]]; then
  bash ${THIS} truncate

  bash base/bin/docker/exec-as.sh database "
    cd /docker/bin
    bash import.sh
  " docker

  bash base/bin/docker/run.sh backend "
    php artisan tinker --execute \"
      \DB::table('system_users')
        ->update([
          'password' => bcrypt('123123')
        ])
    \"
  "

  bash ${THIS} update

  exit
fi
