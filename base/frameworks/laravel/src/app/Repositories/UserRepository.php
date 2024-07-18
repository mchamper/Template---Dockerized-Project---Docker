<?php

namespace App\Repositories;

use App\Core\Bases\BaseRepository;
use App\Models\User;

class UserRepository extends BaseRepository
{
    public static function save(array $input, ?User $user = null): User
    {
        $isNew = !$user;

        if ($isNew) {
            $user = new User();
            $user->status_id = 1;
        }

        static::_fill([
            'first_name',
            'last_name',
            'email',
            'password',
            'status',
        ], $input, $user);

        $user->saveOrFail();

        static::_fillMedia([
            'picture',
            'photos',
        ], $input, $user);

        if (array_key_exists('roles', $input)) {
            $user->syncRoles($input['roles']);
        }

        $user->refresh();

        return $user;
    }
}
