<?php

namespace App\Commons\Auth;

use App\Commons\Response\ErrorEnum;
use App\Enums\SystemUserStatusEnum;
use App\Models\AppClient;
use App\Models\SystemUser;
use Illuminate\Support\Facades\Auth as BaseAuth;

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
            $appClient->checkStatus();
            $appClient->checkHost();
            $appClient->checkScope();
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
                $tokenName = explode('|', $token->name);

                if ($tokenName[0] === 'app_client' && $appClientId = $tokenName[1] ?? null) {
                    self::appClientCheck(AppClient::findOrFail($appClientId));
                }
            }

            if (!$systemUser->status->is(SystemUserStatusEnum::Active)) {
                ErrorEnum::INACTIVE_USER_ERROR->throw();
            }
        }
    }
}
