#!/bin/bash

cd scripts

sh remove-sources.sh
sh build.sh

########################################

# CREAR NUEVO PROYECTO
if [ $1 == "create" ]; then
  sh create-angular.sh web
  sh create-ionic.sh mobile
  sh create-react.sh backoffice
  sh create-laravel backend

# O CLONAR DESDE LOS REPOSITORIOS
else
  sh clone.sh web
  sh clone.sh mobile
  sh clone.sh backoffice
  sh clone.sh backend

  sh run.sh web "yarn -v; yarn install"
  sh run.sh mobile "yarn -v; yarn install"
  sh run.sh backoffice "yarn -v; yarn install"
  sh run.sh backend-php "composer -v; composer install"
  sh run.sh backend-php "php artisan migrate --seed"
fi
