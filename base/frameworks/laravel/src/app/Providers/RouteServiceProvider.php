<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
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
        $this->configureRateLimiting();

        $this->routes(function () {
            Route::prefix('auth/v1')
                ->middleware('api')
                ->namespace('App\Http\Controllers\Auth\v1')
                ->group(base_path('routes/auth.v1.php'));

            /* -------------------- */

            Route::prefix('api/v1/web')
                ->middleware('api')
                ->namespace('App\Http\Controllers\Api\v1\Web')
                ->group(base_path('routes/api.v1.web.php'));

            Route::prefix('api/v1/backoffice')
                ->middleware('api')
                ->namespace('App\Http\Controllers\Api\v1\Backoffice')
                ->group(base_path('routes/api.v1.backoffice.php'));
        });
    }

    /**
     * Configure the rate limiters for the application.
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
