<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'cpf_api' => [
        'access_token' => env('CPF_API_TOKEN'),
    ],
    'clerk' => [
        'publishable_key' => env('CLERK_PUBLISHABLE_KEY'),
        'secret_key' => env('CLERK_SECRET_KEY'),
        'frontend_api_url' => env('CLERK_FRONTEND_API_URL'),
    ],
    'supabase' => [
        'url' => env('SUPABASE_URL'),
        'key' => env('SUPABASE_SERVICE_KEY'),
    ],

];
