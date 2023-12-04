#!/bin/bash

cd /var/app/current

# /opt/elasticbeanstalk/bin/get-config environment | \
#   jq -r "to_entries | .[] | \"\(.key)='\(.value)'\"" > .env

# /opt/elasticbeanstalk/bin/get-config optionsettings | \
#   jq '."aws:elasticbeanstalk:application:environment"' | \
#   jq -r "to_entries | .[] | \"\(.key)='\(.value)'\"" > .env

aws s3 cp s3://aws1-exmaple-environments/backend-prod/.env .env

composer.phar install --optimize-autoloader --no-dev

php artisan config:clear
php artisan route:clear
php artisan view:clear

php artisan config:cache
php artisan route:cache
php artisan view:cache

# nohup php artisan websockets:serve &
