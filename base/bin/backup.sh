#!/bin/bash

. .env || exit 1

BACKUP_PATH=$BACKUP_PATH/Dockerized\ backups

mkdir -p $BACKUP_PATH
mkdir -p $BACKUP_PATH/credentials
mkdir -p $BACKUP_PATH/database-exports
mkdir -p $BACKUP_PATH/environments

cp -a credentials/. $BACKUP_PATH/credentials
cp -a database-exports/. $BACKUP_PATH/database-exports
cp -a environments/. $BACKUP_PATH/environments
cp .env $BACKUP_PATH/.env
