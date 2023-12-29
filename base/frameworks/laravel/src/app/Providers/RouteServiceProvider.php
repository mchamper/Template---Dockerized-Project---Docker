<?php

namespace App\Providers;

use App\Core\Response\Response;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $this->routes(function () {
            Route::get('/health-check', fn() => Response::json());

            /* -------------------- */

            // Route::prefix('')
            //     ->middleware('web')
            //     ->group(base_path('routes/frontend.php'));

            /* -------------------- */

            Route::prefix('auth/v1')
                ->middleware('api')
                ->namespace('App\Http\Controllers\Auth\v1')
                ->group(base_path('routes/auth.v1.php'));

            Route::prefix('auth-session/v1')
                ->middleware('web')
                ->namespace('App\Http\Controllers\Auth\v1')
                ->group(base_path('routes/auth-session.v1.php'));

            /* -------------------- */

            // Route::prefix('api/website/v1')
            //     ->middleware('api')
            //     ->namespace('App\Http\Controllers\Api\Website\v1')
            //     ->group(base_path('routes/api.website.v1.php'));

            // Route::prefix('api/webapp/v1')
            //     ->middleware('api')
            //     ->namespace('App\Http\Controllers\Api\Webapp\v1')
            //     ->group(base_path('routes/api.webapp.v1.php'));

            // Route::prefix('api/mobile/v1')
            //     ->middleware('api')
            //     ->namespace('App\Http\Controllers\Api\Mobile\v1')
            //     ->group(base_path('routes/api.mobile.v1.php'));

            Route::prefix('api/backoffice/v1')
                ->middleware('api')
                ->namespace('App\Http\Controllers\Api\Backoffice\v1')
                ->group(base_path('routes/api.backoffice.v1.php'));
        });
    }
}
