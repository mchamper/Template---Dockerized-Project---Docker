<?php

namespace App\Core\Models\Traits;

use Spatie\Permission\Traits\HasRoles;

trait HasRolesAndPermissions
{
    use HasRoles;

    protected $guard_name = '*';

    public function initializeHasRolesAndPermissions()
    {
        static::_hasRolesAndPermissionsAddHiddens($this);
        static::_hasRolesAndPermissionsAppendAttributes($this);
    }

    /* -------------------- */

    private static function _hasRolesAndPermissionsAddHiddens($model)
    {
        $model->hidden[] = 'roles';
        $model->hidden[] = 'permissions';
    }

    private static function _hasRolesAndPermissionsAppendAttributes($model)
    {
        $model->appendAttributes['roles_and_permissions'] = fn () => [
            'roles' => $model->getRoleNames(),
            'permissions' => $model->getAllPermissions()->map(fn ($item) => $item['name']),
        ];
    }
}
