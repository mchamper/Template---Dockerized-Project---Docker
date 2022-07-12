#!/bin/bash

. bin/core/__base.sh

##############################

if [[ ${CMD} = "add-ip" ]]; then
  IP=${ARG1}
  DESCRIPTION=${ARG2:-${GIT_USER_NAME}}

  bash base/bin/aws/ec2-add-ip.sh backend "security-group-id" "${IP}" "${DESCRIPTION}" 3306
  exit
fi

if [[ ${CMD} = "export-remote" ]]; then
  bash ${THIS} add-ip

  bash base/bin/docker/exec.sh database "
    cd /home/mysql/bin
    bash export-remote.sh
  "

  exit
fi

if [[ ${CMD} = "import" ]]; then
  bash base/bin/docker/exec.sh database "
    cd /home/mysql/bin
    bash import.sh
  "

  bash base/bin/docker/run.sh backend-php "
    php artisan tinker --execute \"
      \DB::table('system_users')
        ->where('username', 'root')
        ->update([
          'password' => bcrypt(env('ROOT_PASSWORD', 'root'))
        ])
    \"

    php artisan migrate --force --seed
  "

  exit
fi
