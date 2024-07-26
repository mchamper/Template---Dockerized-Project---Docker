<?php

namespace App\Repositories;

use App\Core\Bases\BaseRepository;
use App\Models\SystemUser;

class SystemUserRepository extends BaseRepository
{
    public static function save(array $input, ?SystemUser $systemUser = null): SystemUser
    {
        $isNew = !$systemUser;

        if ($isNew) {
            $systemUser = new SystemUser();
            $systemUser->status_id = 1;
        }

        static::_fill([
            'first_name',
            'last_name',
            'email',
            'password',
            'social_id',
            'social_driver_id',
            'social_avatar',
            'status_id',
        ], $input, $systemUser);

        $systemUser->saveOrFail();

        static::_fillMedia([
            'picture',
            'photos',
        ], $input, $systemUser);

        if (array_key_exists('roles', $input)) {
            $systemUser->syncRoles($input['roles']);
        }

        $systemUser->refresh();

        return $systemUser;
    }
}
