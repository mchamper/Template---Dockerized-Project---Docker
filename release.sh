#!/bin/bash

if [[ -f version ]]; then
  echo $1 > version
  git add .
  git commit -m "Version changed"
fi

git pull --all
git flow release start $1
git flow release finish $1 -m
# git push --all
# git push --tags
