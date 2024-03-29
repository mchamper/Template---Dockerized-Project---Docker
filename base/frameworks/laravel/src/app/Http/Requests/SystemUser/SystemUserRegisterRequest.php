<?php

namespace App\Http\Requests\SystemUser;

use App\Core\Bases\BaseRequest;
use Illuminate\Validation\Rules\Password;

class SystemUserRegisterRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public static function rules(?array $params = []): array
    {
        return [
            'first_name' => ['bail', 'required', 'string'],
            'last_name' => ['bail', 'required', 'string'],
            'email' => ['bail', 'required', 'email', 'unique:system_users,email'],
            'password' => ['bail', 'required', 'string', 'confirmed', Password::min(6)],
        ];
    }
}
