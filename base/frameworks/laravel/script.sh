#!/bin/bash

. .env || exit 1

SERVICE=${1}

bash base/bin/docker/run.sh ${SERVICE} "
  composer require \
    marvinlabs/laravel-discord-logger \
    spatie/laravel-data \
    spatie/laravel-medialibrary:^10.0.0 \
    spatie/laravel-permission;

  php artisan vendor:publish --provider=\"MarvinLabs\DiscordLogger\ServiceProvider\"
  php artisan vendor:publish --provider=\"Spatie\LaravelData\LaravelDataServiceProvider\" --tag=\"data-config\"
  php artisan vendor:publish --provider=\"Spatie\MediaLibrary\MediaLibraryServiceProvider\" --tag=\"migrations\"
  php artisan vendor:publish --provider=\"Spatie\Permission\PermissionServiceProvider\"
"
