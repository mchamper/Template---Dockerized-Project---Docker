<?php

namespace App\Repositories;

use App\Models\SystemUser;

class SystemUserRepository extends BaseRepository
{
    public static function save(array $input, ?SystemUser $systemUser = null): SystemUser
    {
        $isNew = false;

        if (!$systemUser) {
            $systemUser = new SystemUser();
            // $systemUser->status()->associate(1);

            $isNew = true;
        }

        static::_fill([
            'first_name',
            'last_name',
            'email',
            'password',
            'picture',
            /* -------------------- */
            // 'status',
        ], $input, $systemUser);

        $systemUser->saveOrFail();

        return $systemUser;
    }
}
