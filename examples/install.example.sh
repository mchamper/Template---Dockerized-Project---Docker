#!/bin/bash

cd scripts

bash sources/create.sh --check-exists || exit 0
bash build.sh

bash sources/clone.sh web "git@github.com:project-name/project-name-web.git" || exit 0
bash sources/clone.sh mobile "git@github.com:project-name/project-name-mobile.git" || exit 0
bash sources/clone.sh backoffice "git@github.com:project-name/project-name-backoffice.git" || exit 0
bash sources/clone.sh backend "git@github.com:project-name/project-name-backend.git" || exit 0

bash run.sh web "yarn install"
bash run.sh mobile "yarn install"
bash run.sh backoffice "yarn install"
bash run.sh backend-php "composer install"
bash run.sh backend-php "php artisan migrate --seed"
