<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($to = env('MAIL_TO_ADDRESS')) {
            Mail::alwaysTo($to);
        }

        Validator::excludeUnvalidatedArrayKeys();

        /* -------------------- */

        RateLimiter::for('api', function () {
            return Limit::perMinute(60)->by(request()->user()?->id ?: request()->ip());
        });

        RateLimiter::for('register', function () {
            return Limit::perMinute(5)->by(request()->user()?->id ?: request()->ip());
        });

        RateLimiter::for('login', function () {
            return [
                Limit::perMinute(60)->by(request()->user()?->id ?: request()->ip()),
                Limit::perMinute(3)->by(request()->input('email')),
            ];
        });

        RateLimiter::for('upload', function () {
            return Limit::perMinute(20)->by(request()->user()?->id ?: request()->ip());
        });

        RateLimiter::for('notification', function () {
            return Limit::perMinute(3)->by(request()->user()?->id ?: request()->ip());
        });
    }
}
