<?php

namespace App\Http\Controllers\Api\v1\Backoffice;

use App\Commons\Auth\Auth;
use App\Commons\Response\Response;
use App\Enums\SystemUserStatusEnum;
use App\Http\Controllers\Controller;
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
                    $combos[$concept] = Role::whereGuardName(Auth::$systemUserGuard)->get()->map(fn ($item) => $item['name']);
                    break;
                }

                case 'system_user_permissions': {
                    $combos[$concept] = Permission::whereGuardName(Auth::$systemUserGuard)->get()->map(fn ($item) => $item['name']);
                    break;
                }

                case 'system_user_statuses': {
                    $combos[$concept] = SystemUserStatusEnum::all();
                    break;
                }
            }
        }

        return Response::json([
            'combos' => $combos,
        ]);
    }
}
