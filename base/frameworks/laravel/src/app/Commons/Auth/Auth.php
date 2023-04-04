<?php

namespace App\Commons\Auth;

use App\Commons\Response\ErrorEnum;
use App\Commons\Response\ErrorEnumException;
use App\Models\AppClient;
use App\Models\SystemUser;
use Illuminate\Support\Facades\Auth as BaseAuth;
use Illuminate\Support\Str;

class Auth extends BaseAuth
{
    public static $appClientGuard = 'app_client';
    public static $systemUserGuard = 'system_user';

    /* -------------------- */

    public static function appClientGuard(): \Illuminate\Contracts\Auth\Guard|\Illuminate\Contracts\Auth\StatefulGuard
    {
        return static::guard(self::$appClientGuard);
    }

    public static function appClient(): ?AppClient
    {
        return static::guard(self::$appClientGuard)->user();
    }

    public static function appClientCheck(?AppClient $appClient = null): void
    {
        if (!$appClient) {
            $appClient = self::appClient();
        }

        if ($appClient) {
            if (!$appClient->is_active) {
                throw new ErrorEnumException(ErrorEnum::INACTIVE_APP_CLIENT_ERROR);
            }

            if ($appClient->scopes !== '*' && !Str::startsWith(Str::finish(request()->path(), '/'), $appClient->scopes)) {
                throw new ErrorEnumException(ErrorEnum::UNAUTHORIZED_SCOPE_ERROR);
            }
        }
    }

    /* -------------------- */

    public static function systemUserGuard(): \Illuminate\Contracts\Auth\Guard|\Illuminate\Contracts\Auth\StatefulGuard
    {
        return static::guard(self::$systemUserGuard);
    }

    public static function systemUser(): ?SystemUser
    {
        return static::guard(self::$systemUserGuard)->user();
    }

    public static function systemUserCheck(?SystemUser $systemUser = null): void
    {
        if (!$systemUser) {
            $systemUser = self::systemUser();
        }

        if ($systemUser) {
            if ($token = $systemUser->currentAccessToken()) {
                if ($appClientId = explode('|', $token->name)[1] ?? null) {
                    self::appClientCheck(AppClient::findOrFail($appClientId));
                }
            }

            if (!$systemUser->is_active) {
                throw new ErrorEnumException(ErrorEnum::INACTIVE_USER_ERROR);
            }
        }
    }
}
