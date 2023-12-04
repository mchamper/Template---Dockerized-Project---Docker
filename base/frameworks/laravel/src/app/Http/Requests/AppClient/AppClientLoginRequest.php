<?php

namespace App\Http\Requests\AppClient;

use App\Core\Bases\BaseRequest;

class AppClientLoginRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public static function rules(?array $params = []): array
    {
        return [
            'key' => ['bail', 'required', 'string'],
            'secret' => ['bail', 'required', 'string'],
        ];
    }
}
