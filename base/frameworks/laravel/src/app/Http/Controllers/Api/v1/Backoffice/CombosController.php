<?php

namespace App\Http\Controllers\Api\v1\Backoffice;

use App\Commons\Response\Response;
use App\Enums\SystemUserStatusEnum;
use App\Http\Controllers\Controller;

class CombosController extends Controller
{
    public function get()
    {
        $concepts = explode(',', request()->query('concepts'));
        $combos = [];

        foreach ($concepts as $concept) {
            switch ($concept) {
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
