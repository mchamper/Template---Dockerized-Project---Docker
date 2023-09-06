#!/bin/bash

cd /var/app/current

chown -R ec2-user:webapp storage bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache
