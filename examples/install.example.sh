#!/bin/bash

bash base/bin/sources/create.sh --check-exists || exit 1
bash base/bin/docker/build.sh || exit 1

########################################

bash base/bin/git/clone.sh web "git@github.com:project-name/project-name-web.git" develop || exit 1
bash base/bin/git/clone.sh mobile "git@github.com:project-name/project-name-mobile.git" develop || exit 1
bash base/bin/git/clone.sh backoffice "git@github.com:project-name/project-name-backoffice.git" develop || exit 1
bash base/bin/git/clone.sh backend "git@github.com:project-name/project-name-backend.git" develop || exit 1

bash base/bin/docker/start.sh

sleep 10

bash base/bin/docker/exec.sh web "yarn install"
bash base/bin/docker/exec.sh mobile "yarn install"
bash base/bin/docker/exec.sh backoffice "yarn install"
bash base/bin/docker/exec.sh backend-php "composer install"
bash base/bin/docker/exec.sh backend-php "php artisan migrate --seed"

bash base/bin/docker/exec.sh database "cd /var/exports; bash export.sh; bash import.sh"
