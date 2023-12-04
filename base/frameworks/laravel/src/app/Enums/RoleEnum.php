<?php

namespace App\Enums;

use App\Core\Bases\BaseEnum;
use App\Facades\Auth;
use Spatie\Permission\Models\Role;

enum RoleEnum
{
    use BaseEnum;

    case Root;
    case Admin;

    /* -------------------- */

    public function data(): array
    {
        return [];
    }

    public function model(): Role
    {
        return Role::where('name', $this->name)->where('guard_name', Auth::getSystemUserGuardName())->first();
    }
}
