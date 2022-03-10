#!/bin/bash

. .env || exit 1

CMD=${1}; ARG1=${2}; ARG2=${3}; ARG3=${4}; ARG4=${5}; ARG5=${6};
SERVICE=backend

if [[ ${CMD} = "add-ip" ]]; then
  IP=${ARG1}
  DESCRIPTION=${ARG2}

  bash base/bin/aws/ec2-add-ip.sh ${SERVICE} "security-group-id" "${IP}" "${DESCRIPTION}" 3306
  exit
fi

if [[ ${CMD} = "export-remote" ]]; then
  bash base/bin/docker/exec.sh database "
    cd /home/mysql/bin;
    bash export-remote.sh;
  "

  exit
fi

if [[ ${CMD} = "import" ]]; then
  bash base/bin/docker/exec.sh database "
    cd /home/mysql/bin;
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

  exit
fi
