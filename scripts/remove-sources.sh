#!/bin/bash

. ../.env

rm -rf .$SRC_WEB
rm -rf .$SRC_MOBILE
rm -rf .$SRC_BACKOFFICE
rm -rf .$SRC_BACKEND

mkdir .$SRC_WEB
mkdir .$SRC_MOBILE
mkdir .$SRC_BACKOFFICE
mkdir .$SRC_BACKEND
