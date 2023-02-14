<?php

return [
    'guards' => [
        'api:user' => [
            'driver' => 'jwt',
            'provider' => 'users',
        ],

        'api:system-user' => [
            'driver' => 'jwt',
            'provider' => 'system-users',
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],

        'system-users' => [
            'driver' => 'eloquent',
            'model' => App\Models\SystemUser::class,
        ],
    ]
];
