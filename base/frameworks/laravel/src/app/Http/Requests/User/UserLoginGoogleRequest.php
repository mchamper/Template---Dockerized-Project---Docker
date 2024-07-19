<?php

namespace App\Http\Requests\User;

use App\Core\Bases\BaseRequest;

class UserLoginGoogleRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public static function rules(?array $params = []): array
    {
        return [
            'token' => ['bail', 'required'],
            'remember_me' => ['bail', 'nullable', 'boolean'],
        ];
    }
}
