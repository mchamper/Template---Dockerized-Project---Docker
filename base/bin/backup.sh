#!/bin/bash

. .env || exit 1

if [[ $BACKUP_PATH = "" ]]; then
  echo "You must set a value to BACKUP_PATH var in your .env file."
  exit 1
fi

FOLDER_NAME="Dockerized backup"
BACKUP_PATH="$BACKUP_PATH/$FOLDER_NAME"

mkdir -p "$BACKUP_PATH"
mkdir -p "$BACKUP_PATH/credentials"
mkdir -p "$BACKUP_PATH/database-exports"
mkdir -p "$BACKUP_PATH/environments"

cp -a credentials/. "$BACKUP_PATH/credentials"
cp -a database-exports/. "$BACKUP_PATH/database-exports"
cp -a environments/. "$BACKUP_PATH/environments"
cp .env "$BACKUP_PATH/.env"

if [[ $1 = "--zip" ]]; then
  PASSWORD=$(bash base/bin/generate-password.sh 64)

  cd "$BACKUP_PATH/.."
  if [[ -f "$FOLDER_NAME.zip" ]]; then rm "$FOLDER_NAME.zip"; fi
  if [[ -f "$FOLDER_NAME.zip.txt" ]]; then rm "$FOLDER_NAME.zip.txt"; fi

  SECURE=""

  if [[ $2 = "--secure" ]]; then
    SECURE="-e"

    echo $PASSWORD > "$FOLDER_NAME.zip.txt"
    echo "Use this password (copy/paste below): $PASSWORD"
  fi

  zip -r "$FOLDER_NAME.zip" "$FOLDER_NAME" \
    -x "$FOLDER_NAME/credentials/.aws/*" \
    -x "$FOLDER_NAME/database-exports/dump.sql" \
    $SECURE

  exit
fi
