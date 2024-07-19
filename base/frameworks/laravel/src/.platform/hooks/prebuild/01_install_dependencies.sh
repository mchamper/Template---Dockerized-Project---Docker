#!/bin/bash

yum -y install libzip libzip-devel
pecl upgrade zip
