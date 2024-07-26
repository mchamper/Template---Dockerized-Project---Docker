#!/bin/bash

. .env || exit 1

SERVICE=${1}
MANAGER=${2:-"npm"}

bash base/bin/docker/run.sh ${SERVICE} "
  ${MANAGER} install \
    @abacritt/angularx-social-login \
    bootstrap \
    crypto-js \
    hls.js \
    lodash \
    moment \
    ng-zorro-antd \
    ngx-mask \
    ng2-currency-mask \
    ngx-webstorage \
    ngx-device-detector \
    ngx-pixel-eventid \
    angular-google-tag-manager \
    animate.css \
    simplebar \
    ngxtension \
    @ngx-translate/core \
    @ngx-translate/http-loader \
    swiper;

  ${MANAGER} install --save-dev \
    @types/crypto-js \
    @types/lodash;
"
