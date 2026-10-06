<?php

$uri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($uri, PHP_URL_PATH) ?: '/';

if (($_SERVER['SCRIPT_NAME'] ?? '') === '/api/index.php') {
    $_SERVER['SCRIPT_NAME'] = '';
    $_SERVER['PHP_SELF'] = $path;
    $_SERVER['PATH_INFO'] = $path;
}

require __DIR__ . '/../public/index.php';
