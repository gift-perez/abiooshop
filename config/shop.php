<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Admin account
    |--------------------------------------------------------------------------
    |
    | Used by the UserSeeder to create / update the store admin. Set these in
    | your host's environment variables. Never commit a real password.
    |
    */

    'admin' => [
        'email' => env('ADMIN_EMAIL', 'admin@example.com'),
        'password' => env('ADMIN_PASSWORD'),
    ],

    /*
    | Demo customer that owns the sample orders (DemoOrderSeeder). It can only
    | be logged into when DEMO_PASSWORD is set, e.g. to share a demo login.
    */

    'demo' => [
        'email' => env('DEMO_EMAIL', 'demo@example.com'),
        'password' => env('DEMO_PASSWORD'),
    ],

];
