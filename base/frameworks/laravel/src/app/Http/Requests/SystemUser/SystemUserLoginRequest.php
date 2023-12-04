<?php

namespace App\Http\Requests\SystemUser;

use App\Core\Bases\BaseRequest;

class SystemUserLoginRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public static function rules(?array $params = []): array
    {
        return [
            'email' => ['bail', 'required', 'string'],
            'password' => ['bail', 'required', 'string'],
            'remember_me' => ['bail', 'nullable', 'boolean'],
        ];
    }
}
