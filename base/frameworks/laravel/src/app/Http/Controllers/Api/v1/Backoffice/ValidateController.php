<?php

namespace Teatrix\Http\Controllers\Common\API;

use Exception;
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

            default: throw new Exception('Invalid request concept.');
        }

        $validated = Validator::make($input, $rules)->validate();

        return Response::json([
            'validated' => $validated
        ]);
    }
}
