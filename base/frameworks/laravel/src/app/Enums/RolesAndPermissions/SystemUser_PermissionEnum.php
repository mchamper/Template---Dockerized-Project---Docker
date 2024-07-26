<?php

namespace App\Enums\RolesAndPermissions;

use App\Core\Bases\BaseEnum;
use Spatie\Permission\Models\Permission;

enum SystemUser_PermissionEnum
{
    use BaseEnum;

    case SystemUserGet;
    case SystemUserCreate;
    case SystemUserUpdate;
    case SystemUserDelete;
    case SystemUserLoginAs;
    case SystemUserActivate;
    case SystemUserDeactivate;
    case RoleGet;
    case RoleCreate;
    case RoleUpdate;
    case RoleDelete;
    case RoleSyncPermission;
    case RoleSyncUser;

    /* -------------------- */

    public function data(): array
    {
        return [];
    }

    public static function guard(): string
    {
        return 'api_system-user';
    }

    public  function model(): Permission
    {
        return Permission::where('name', $this->name)->where('guard_name', self::guard())->first();
    }
}
