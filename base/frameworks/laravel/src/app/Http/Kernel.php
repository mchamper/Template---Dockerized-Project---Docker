<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middlewareGroups = [
        'api' => [
            \App\Http\Middleware\ReturnJson::class,
        ],
    ];

    protected $routeMiddleware = [
        'auth.check.channel' => \App\Http\Middleware\AuthCheckChannel::class,
    ];
}
