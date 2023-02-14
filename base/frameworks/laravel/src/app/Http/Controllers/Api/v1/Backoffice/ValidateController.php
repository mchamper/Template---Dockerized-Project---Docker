<?php

namespace Teatrix\Http\Controllers\Common\API;

use Exception;
use Illuminate\Support\Facades\Validator;
use Teatrix\Commons\Response\Response;
use Teatrix\Http\Requests\GiftCardRequestCreateRequest;

class ValidateController
{
    public function validate(string $concept)
    {
        $input = request()->post();
        $rules = [];

        switch ($concept) {
            case 'gift_card_request_create': $rules = (new GiftCardRequestCreateRequest())->rulesFrom($input); break;

            default: throw new Exception('Concepto de validación inválido.');
        }

        $validated = Validator::make($input, $rules)->validate();

        return Response::json([
            'validated' => $validated
        ]);
    }
}