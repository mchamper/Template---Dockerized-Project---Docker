#!/bin/bash

. ../../.env

IFS=';' read -a sources <<< $SRCS

for src in "${sources[@]}"; do
  service=${src%%:*}
  path="../.${src##*:}"

  if [[ $1 = $service ]]; then
    if [ ! -d "$path/.git" ]; then
      git clone $2 $path || exit 1

      cd $path
      git config user.name "$GIT_USER_NAME"
      git config user.email "$GIT_USER_EMAIL"

      if [[ $3 != "" ]]; then
        git checkout $3
      fi

      echo "Cloned \"$2\" in \"$path\""
    else
      echo "Repository already exists in \"$path\""
    fi

    exit 0
  fi
done
