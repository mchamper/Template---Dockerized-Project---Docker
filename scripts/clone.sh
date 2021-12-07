#!/bin/bash

. ../.env

case $1 in

  web)
    src=../$SRC_WEB
    src_git=$SRC_WEB_GIT
    ;;

  mobile)
    src=../$SRC_MOBILE
    src_git=$SRC_MOBILE_GIT
    ;;

  backoffice)
    src=../$SRC_BACKOFFICE
    src_git=$SRC_BACKOFFICE_GIT
    ;;

  backend)
    src=../$SRC_BACKEND
    src_git=$SRC_BACKEND_GIT
    ;;
esac

git clone $src_git $src || exit 0

cd $src
git config user.name "$GIT_USER_NAME"
git config user.email "$GIT_USER_EMAIL"
git checkout develop
