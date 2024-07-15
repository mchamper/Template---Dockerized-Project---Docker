#!/bin/bash

. .env || exit 1

SERVICE=${1}

bash base/bin/docker/run.sh ${SERVICE} "
  composer require \
    laravel/socialite \
    marvinlabs/laravel-discord-logger \
    mvanduijker/laravel-model-exists-rule \
    spatie/laravel-medialibrary:^10.0.0 \
    spatie/laravel-permission \
    spatie/laravel-data \
    laravel/telescope \
    orangehill/iseed \
    google/apiclient;

  php artisan vendor:publish --provider=\"MarvinLabs\DiscordLogger\ServiceProvider\"
  php artisan vendor:publish --provider=\"Spatie\MediaLibrary\MediaLibraryServiceProvider\" --tag=\"migrations\"
  php artisan vendor:publish --provider=\"Spatie\Permission\PermissionServiceProvider\"
  php artisan vendor:publish --provider=\"Spatie\LaravelData\LaravelDataServiceProvider\" --tag=\"data-config\"
  php artisan telescope:install
"
