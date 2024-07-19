#!/bin/bash

sudo chown -R ec2-user:webapp storage bootstrap/cache
sudo chmod -R ug+rwx storage bootstrap/cache
