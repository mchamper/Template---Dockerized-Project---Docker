#!/bin/bash

bash base/bin/sources/create.sh --all || exit 1
bash base/bin/docker/build.sh || exit 1

########################################

bash base/bin/git/clone.sh web "git@github.com:project-name/project-name-web.git" develop
bash base/bin/git/clone.sh mobile "git@github.com:project-name/project-name-mobile.git" develop
bash base/bin/git/clone.sh backoffice "git@github.com:project-name/project-name-backoffice.git" develop
bash base/bin/git/clone.sh backend "git@github.com:project-name/project-name-backend.git" develop

bash base/bin/docker/run.sh web "yarn install"
bash base/bin/docker/run.sh mobile "yarn install"
bash base/bin/docker/run.sh backoffice "yarn install"
bash base/bin/docker/run.sh backend-php "composer install"

bash base/bin/docker/start.sh database
sleep 30

bash base/bin/docker/run.sh backend-php "php artisan migrate --seed"

bash base/bin/docker/exec.sh database "
  cd /home/mysql/bin;
  bash export-remote.sh;
  bash import.sh;
"

bash base/bin/docker/down.sh
