<?php

namespace App\Http\Controllers\Api\Backoffice\v1;

use App\Core\Response\Response;
use App\Enums\ErrorEnum;
use App\Enums\SystemUserStatusEnum;
use App\Http\Controllers\Controller;
use Exception;
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
                case 'roles': {
                    $combos[$concept] = Role::all()->pluck('name');
                    break;
                }

                case 'permissions': {
                    $combos[$concept] = Permission::all()->pluck('name');
                    break;
                }

                case 'system_user_statuses': {
                    $combos[$concept] = SystemUserStatusEnum::all();
                    break;
                }

                default: ErrorEnum::INVALID_REQUEST_CONCEPT->throw();
            }
        }

        return Response::json([
            'combos' => $combos,
        ]);
    }
}
