<?php

namespace App\Commons\Auth;

use App\Models\SystemUser;
use App\Models\User;
use Illuminate\Support\Facades\Auth as BaseAuth;

class Auth extends BaseAuth
{
    public static $apiUserGuard = 'api:user';
    public static $apiSystemUserGuard = 'api:system-user';

    /* -------------------- */

    public static function apiUserGuard()
    {
        return static::guard(self::$apiUserGuard);
    }

    public static function apiUser(): User
    {
        return static::guard(self::$apiUserGuard)->user();
    }

    /* -------------------- */

    public static function apiSystemUserGuard()
    {
        return static::guard(self::$apiSystemUserGuard);
    }

    public static function apiSystemUser(): SystemUser
    {
        return static::guard(self::$apiSystemUserGuard)->user();
    }
}
