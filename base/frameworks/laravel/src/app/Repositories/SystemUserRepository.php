<?php

namespace App\Repositories;

use App\Enums\SystemUserStatusEnum;
use App\Models\SystemUser;

class SystemUserRepository extends BaseRepository
{
    public static function save(array $input, ?SystemUser $systemUser = null): SystemUser
    {
        $isNew = false;

        if (!$systemUser) {
            $systemUser = new SystemUser();
            $systemUser->status = SystemUserStatusEnum::Active;

            $isNew = true;
        }

        static::_fill([
            'first_name',
            'last_name',
            'email',
            'password',
            'social_id',
            'social_driver',
            'social_avatar',
            'status',
            /* -------------------- */
        ], $input, $systemUser);

        $systemUser->saveOrFail();

        static::_fillMedia([
            'picture',
            'photos' => true,
        ], $input, $systemUser);

        $systemUser->refresh();

        return $systemUser;
    }
}
