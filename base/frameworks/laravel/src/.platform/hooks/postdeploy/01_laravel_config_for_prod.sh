#!/bin/bash

cd /var/app/current

chown -R ec2-user:webapp storage bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache

/opt/elasticbeanstalk/bin/get-config environment | jq -r "to_entries | .[] | \"\(.key)='\(.value)'\"" > .env
composer.phar install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
