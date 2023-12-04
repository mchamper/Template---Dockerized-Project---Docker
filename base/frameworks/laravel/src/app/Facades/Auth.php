<?php

namespace App\Facades;

use App\Models\AppClient;
use App\Models\SystemUser;
use Illuminate\Support\Facades\Auth as AuthFacade;

class Auth extends AuthFacade
{
    public static function getAppClientGuardName(): string
    {
        return 'app_client';
    }

    public static function getSystemUserGuardName(): string
    {
        return 'system_user';
    }

    /* -------------------- */

    public static function appClientGuard(): \Illuminate\Contracts\Auth\Guard|\Illuminate\Contracts\Auth\StatefulGuard
    {
        return static::guard(self::getAppClientGuardName());
    }

    public static function systemUserGuard(): \Illuminate\Contracts\Auth\Guard|\Illuminate\Contracts\Auth\StatefulGuard
    {
        return static::guard(self::getSystemUserGuardName());
    }

    /* -------------------- */

    public static function appClient(): ?AppClient
    {
        return self::appClientGuard()->user();
    }

    public static function systemUser(): ?SystemUser
    {
        return self::systemUserGuard()->user();
    }

    /* -------------------- */

    public static function verifyAppClient(?AppClient $appClient = null): void
    {
        if (!$appClient) {
            $appClient = self::appClient();
        }

        if ($appClient) {
            $appClient->verifyStatus();
            $appClient->verifyHost();
            $appClient->verifyScope();
        }
    }

    public static function verifySystemUser(?SystemUser $systemUser = null): void
    {
        if (!$systemUser) {
            $systemUser = self::systemUser();
        }

        if ($systemUser) {
            if ($token = $systemUser->currentAccessToken()) {
                $tokenName = explode('|', $token->name);

                if ($tokenName[0] === 'app_client' && $appClientId = $tokenName[1] ?? null) {
                    self::verifyAppClient(AppClient::findOrFail($appClientId));
                }
            }

            $systemUser->verifyStatus();
        }
    }
}
