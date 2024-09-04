<?php

namespace App\Core\Services;

class AuthService
{
    public static function getCurrentGuard()
    {
        foreach (config('auth.guards') as $guard => $guardConfig) {
            if (auth($guard)->check()) {
                return auth($guard);
            }
        }
    }
}
