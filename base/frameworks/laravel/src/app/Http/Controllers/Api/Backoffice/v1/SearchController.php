<?php

namespace App\Http\Controllers\Api\Backoffice\v1;

use App\Core\Response\Response;
use App\Enums\Response\ErrorEnum;
use App\Http\Controllers\Controller;
use App\Services\LocationService;

class SearchController extends Controller
{
    public function search()
    {
        $concept = request()->query('concept');
        $query = request()->query('query');
        $results = [];

        switch ($concept) {
            case 'locations': {
                $results = LocationService::search($query);
                break;
            }

            default: ErrorEnum::InvalidRequestConcept->throw();
        }

        return Response::json([
            'results' => $results
        ]);
    }
}
