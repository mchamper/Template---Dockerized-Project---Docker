#!/bin/bash

cd base/commands

if [[ $1 = "--force" ]]; then
  bash sources/remove.sh || exit 1
fi

bash sources/create.sh --check-exists || exit 1
bash docker/build.sh || exit 1

########################################

bash sources/clone.sh web "git@github.com:project-name/project-name-web.git" develop || exit 1
bash sources/clone.sh mobile "git@github.com:project-name/project-name-mobile.git" develop || exit 1
bash sources/clone.sh backoffice "git@github.com:project-name/project-name-backoffice.git" develop || exit 1
bash sources/clone.sh backend "git@github.com:project-name/project-name-backend.git" develop || exit 1

bash docker/run.sh web "yarn install"
bash docker/run.sh mobile "yarn install"
bash docker/run.sh backoffice "yarn install"
bash docker/run.sh backend-php "composer install"
bash docker/run.sh backend-php "php artisan migrate --seed"
