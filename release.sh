#!/bin/bash

if [[ -f version ]]; then
  $2 > version
fi

git pull --all
git flow release start $2
git flow release finish $2 -m
git push --all
git push --tags
