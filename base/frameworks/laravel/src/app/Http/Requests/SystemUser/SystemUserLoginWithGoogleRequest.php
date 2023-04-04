<?php

namespace App\Http\Requests\SystemUser;

use App\Http\Requests\BaseRequest;

class SystemUserLoginWithGoogleRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public static function rules(?array $params = []): array
    {
        return [
            'token' => ['bail', 'required', 'string'],
            'remember_me' => ['bail', 'nullable', 'boolean'],
        ];
    }
}
