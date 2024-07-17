<?php

namespace App\Enums;

use App\Core\Bases\BaseEnum;
use Spatie\Permission\Models\Permission;

enum PermissionEnum
{
    use BaseEnum;

    case SystemUserGet;
    case SystemUserCreate;
    case SystemUserUpdate;
    case SystemUserDelete;
    case SystemUserLoginAs;
    case SystemUserActivate;
    case SystemUserDeactivate;

    /* -------------------- */

    public function data(): array
    {
        return [];
    }

    public function model(): Permission
    {
        // return Permission::where('name', $this->name)->where('guard_name', 'web')->first();
        return Permission::where('name', $this->name)->first();
    }
}
