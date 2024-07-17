#!/bin/bash

. .env || exit 1

SERVICE=${1}

bash base/bin/docker/run.sh ${SERVICE} "
  composer require \
    laravel/socialite \
    laravel/telescope \
    laravel/horizon \
    marvinlabs/laravel-discord-logger \
    mvanduijker/laravel-model-exists-rule \
    spatie/laravel-medialibrary \
    spatie/laravel-permission \
    spatie/laravel-translatable \
    spatie/laravel-tags \
    spatie/laravel-data \
    orangehill/iseed \
    google/apiclient;

  composer require --dev \
    barryvdh/laravel-ide-helper;

  php artisan vendor:publish --provider=\"MarvinLabs\DiscordLogger\ServiceProvider\"
  php artisan vendor:publish --provider=\"Spatie\MediaLibrary\MediaLibraryServiceProvider\" --tag=\"medialibrary-migrations\"
  php artisan vendor:publish --provider=\"Spatie\MediaLibrary\MediaLibraryServiceProvider\" --tag=\"medialibrary-config\"
  php artisan vendor:publish --provider=\"Spatie\Permission\PermissionServiceProvider\"
  php artisan vendor:publish --provider=\"Spatie\Tags\TagsServiceProvider\" --tag="tags-migrations"
  php artisan vendor:publish --provider=\"Spatie\LaravelData\LaravelDataServiceProvider\" --tag=\"data-config\"
  php artisan telescope:install
  php artisan horizon:install
"
