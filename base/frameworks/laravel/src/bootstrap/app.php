<?php

use App\Console\Commands\MediaDeleteTrashed;
use App\Core\Response\Error;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withSchedule(function (Schedule $schedule) {
        // https://crontab.guru

        if (app()->environment('local')) {
            $schedule->command('inspire')
                ->everyFiveMinutes()
                ->sendOutputTo(storage_path('logs/laravel-schedule--inspire.log'));
        }

        /* -------------------- */

        $schedule->command('telescope:prune --hours=24')->daily();
        $schedule->command(MediaDeleteTrashed::class)->daily();
    })
    ->withRouting(
        // web: __DIR__.'/../routes/web.php',
        // api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::prefix('')
                ->group(base_path('routes/media.php'));

            Route::middleware('api')
                ->prefix('api/auth/v1')
                ->group(base_path('routes/api/auth.v1.php'));

            Route::middleware('api')
                ->prefix('api/backoffice/v1')
                ->group(base_path('routes/api/backoffice.v1.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->appendToGroup('web', [
            \App\Core\Middleware\SessionExpiresAt::class,
        ]);

        $middleware->appendToGroup('api', [
            'throttle:api'
        ]);

        $middleware->append(\App\Core\Middleware\ReturnJson::class);
        $middleware->append(\App\Core\Middleware\SetLocale::class);
        $middleware->append(\App\Core\Middleware\QueryParamApiToken::class);
        $middleware->append(\App\Core\Middleware\VerifyAuth::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(fn (Response $response, Throwable $e) => Error::respond($e, $response));
    })
    ->create();
