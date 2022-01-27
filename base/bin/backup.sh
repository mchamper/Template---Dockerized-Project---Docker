#!/bin/bash

. .env || exit 1

if [[ $BACKUP_PATH = "" ]]; then
  echo "You must set a value to BACKUP_PATH var in your .env file."
  exit 1
fi

FOLDER_NAME="Docker backup"
ZIP_NAME="$FOLDER_NAME ($COMPOSE_PROJECT_NAME).zip"
BACKUP_PATH="$BACKUP_PATH/$FOLDER_NAME"
PASSWORD=$(bash base/bin/generate-password.sh 64)

mkdir -p "$BACKUP_PATH"
mkdir -p "$BACKUP_PATH/examples/credentials/.aws"
mkdir -p "$BACKUP_PATH/credentials"
mkdir -p "$BACKUP_PATH/database-exports"
mkdir -p "$BACKUP_PATH/environments"

cp -a examples/credentials/.aws/. "$BACKUP_PATH/examples/credentials/.aws"
cp -a credentials/. "$BACKUP_PATH/credentials"
cp -a database-exports/. "$BACKUP_PATH/database-exports"
cp -a environments/. "$BACKUP_PATH/environments"

cd "$BACKUP_PATH/.."
if [[ -f "$ZIP_NAME" ]]; then rm "$ZIP_NAME"; fi
if [[ -f "$ZIP_NAME.txt" ]]; then rm "$ZIP_NAME.txt"; fi

ENCRYPT=""

if [[ $1 = "--encrypt" ]]; then
  ENCRYPT="-e"

  echo $PASSWORD > "$ZIP_NAME.txt"
  echo "Use this password (copy/paste below): $PASSWORD"
fi

zip -r "$ZIP_NAME" "$FOLDER_NAME" \
  -x "$FOLDER_NAME/credentials/.aws/*" \
  -x "$FOLDER_NAME/database-exports/dump.sql" \
  $ENCRYPT
