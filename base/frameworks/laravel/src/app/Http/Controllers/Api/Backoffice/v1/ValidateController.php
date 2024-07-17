<?php

namespace App\Http\Controllers\Api\Backoffice\v1;

use App\Core\Response\Response;
use App\Enums\Response\ErrorEnum;
use App\Http\Requests\User\UserCreateRequest;
use Illuminate\Support\Facades\Validator;

class ValidateController
{
    public function validate()
    {
        $concept = request()->query('concept');
        $input = request()->post();
        $rules = [];

        switch ($concept) {
            case 'system_user_create': $rules = UserCreateRequest::rulesFrom($input, ['userTable' => 'system_users']); break;

            default: ErrorEnum::InvalidRequestConcept->throw();
        }

        $validated = Validator::make($input, $rules)->validate();

        return Response::json([
            'validated' => $validated
        ]);
    }
}
