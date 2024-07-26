<?php

namespace App\Http\Controllers\Api\Backoffice\v1;

use App\Core\Response\Response;
use App\Enums\Response\ErrorEnum;
use App\Enums\RolesAndPermissions\SystemUser_PermissionEnum;
use App\Enums\RolesAndPermissions\SystemUser_RoleEnum;
use App\Http\Controllers\Controller;
use App\Models\AuthStatus;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CombosController extends Controller
{
    public function get()
    {
        $concepts = explode(',', request()->query('concepts'));
        $combos = [];

        foreach ($concepts as $concept) {
            $conceptExploded = explode(':', $concept);
            $conceptParam = $conceptExploded[1] ?? null;
            $concept = $conceptExploded[0];

            switch ($concept) {
                case 'system_user_roles': {
                    $combos[$concept] = Role::where('guard_name', SystemUser_RoleEnum::guard())->get();
                    break;
                }

                case 'system_user_permissions': {
                    $combos[$concept] = Permission::where('guard_name', SystemUser_PermissionEnum::guard())->get();
                    break;
                }

                case 'auth_statuses': {
                    $combos[$concept] = AuthStatus::all();
                    break;
                }

                default: ErrorEnum::InvalidRequestConcept->throw();
            }
        }

        return Response::json([
            'combos' => $combos,
        ]);
    }
}
