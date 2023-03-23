<?php

namespace App\Commons\Auth;

use App\Models\SystemUser;
use Illuminate\Support\Facades\Auth as BaseAuth;

class Auth extends BaseAuth
{
    public static $apiSystemUserGuard = 'api_system_user';

    /* -------------------- */

    public static function apiSystemUserGuard()
    {
        return static::guard(self::$apiSystemUserGuard);
    }

    public static function apiSystemUser(): ?SystemUser
    {
        return static::guard(self::$apiSystemUserGuard)->user();
    }
}
