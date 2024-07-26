<?php

namespace App\Enums\RolesAndPermissions;

use App\Core\Bases\BaseEnum;
use Spatie\Permission\Models\Role;

enum SystemUser_RoleEnum
{
    use BaseEnum;

    case Root;
    case Admin;

    /* -------------------- */

    public function data(): array
    {
        return [];
    }

    public static function guard(): string
    {
        return 'api_system-user';
    }

    public function model(): Role
    {
        return Role::where('name', $this->name)->where('guard_name', self::guard())->first();
    }
}
