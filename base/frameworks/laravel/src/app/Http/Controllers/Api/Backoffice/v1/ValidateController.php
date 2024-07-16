<?php

namespace App\Http\Controllers\Api\Backoffice\v1;

use App\Core\Response\Response;
use App\Enums\Response\ErrorEnum;
use Illuminate\Support\Facades\Validator;

class ValidateController
{
    public function validate()
    {
        $concept = request()->query('concept');
        $input = request()->post();
        $rules = [];

        switch ($concept) {
            // case 'example_entity_create': $rules = ExampleEntityCreateRequest::rulesFrom($input); break;

            default: ErrorEnum::InvalidRequestConcept->throw();
        }

        $validated = Validator::make($input, $rules)->validate();

        return Response::json([
            'validated' => $validated
        ]);
    }
}
