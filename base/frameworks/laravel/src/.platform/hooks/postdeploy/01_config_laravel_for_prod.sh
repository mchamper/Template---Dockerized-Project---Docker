#!/bin/bash

aws s3 cp s3://aws1-exmaple-environments/backend-prod/.env .env

composer.phar install --optimize-autoloader --no-dev

php artisan config:clear
php artisan route:clear
php artisan view:clear

php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan queue:restart
