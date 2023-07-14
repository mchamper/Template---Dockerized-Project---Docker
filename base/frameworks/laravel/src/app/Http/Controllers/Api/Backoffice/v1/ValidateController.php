<?php

namespace App\Http\Controllers\Api\Backoffice\v1;

use App\Commons\Response\ErrorEnum;
use Illuminate\Support\Facades\Validator;
use App\Commons\Response\Response;

class ValidateController
{
    public function validate()
    {
        $concept = request()->query('concept');
        $input = request()->post();
        $rules = [];

        switch ($concept) {
            // case 'example_entity_create': $rules = (new ExampleEntityCreateRequest())->rulesFrom($input); break;

            default: ErrorEnum::INVALID_REQUEST_CONCEPT->throw();
        }

        $validated = Validator::make($input, $rules)->validate();

        return Response::json([
            'validated' => $validated
        ]);
    }
}
