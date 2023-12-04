<?php

namespace App\Repositories;

use App\Core\Bases\BaseRepository;
use App\Enums\RoleEnum;
use App\Enums\SystemUserStatusEnum;
use App\Models\SystemUser;

class SystemUserRepository extends BaseRepository
{
    public static function save(array $input, ?SystemUser $systemUser = null): SystemUser
    {
        $isNew = !$systemUser;

        if ($isNew) {
            $systemUser = new SystemUser();
            $systemUser->status = SystemUserStatusEnum::Active;
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
        ], $input, $systemUser);

        $systemUser->saveOrFail();

        static::_fillMedia([
            'picture',
            'photos' => true,
        ], $input, $systemUser);

        if (array_key_exists('roles', $input)) {
            $systemUser->syncRoles(RoleEnum::tryFromNames($input['roles']));
        }

        $systemUser->refresh();

        return $systemUser;
    }
}
