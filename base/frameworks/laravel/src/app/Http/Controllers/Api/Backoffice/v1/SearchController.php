<?php

namespace App\Http\Controllers\Api\Backoffice\v1;

use App\Core\Response\Response;
use App\Enums\ErrorEnum;
use App\Http\Controllers\Controller;
use App\Services\LocationService;

class SearchController extends Controller
{
    public function search()
    {
        $concept = request()->query('concept');
        $search = request()->query('search');
        $results = [];

        switch ($concept) {
            case 'locations': {
                $results = LocationService::search($search);

                break;
            }

            default: ErrorEnum::INVALID_REQUEST_CONCEPT->throw();
        }

        return Response::json([
            'results' => $results
        ]);
    }
}
