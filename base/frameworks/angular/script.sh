#!/bin/bash

. .env || exit 1

SERVICE=${1}
MANAGER=${2:-"npm"}

bash base/bin/docker/run.sh ${SERVICE} "
  ${MANAGER} install \
    @ant-design/icons-angular \
    bootstrap \
    crypto-js \
    hls.js \
    lodash \
    moment \
    ng-zorro-antd \
    ngx-mask \
    ngx-webstorage \
    ngx-device-detector \
    ngx-pixel \
    angular-google-tag-manager \
    simplebar \
    swiper;

  ${MANAGER} install --save-dev \
    @types/crypto-js \
    @types/lodash;
"
