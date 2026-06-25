#!/bin/bash
PHP_INI_SCAN_DIR="/etc/php/8.1/cli/conf.d:/home/nathan/tcc-salomao/app-salomao/php-conf.d" php artisan "$@"
