<?php

namespace App\Http\Requests\SystemUser;

use App\Core\Bases\BaseRequest;
use Illuminate\Validation\Rules\File;
use Illuminate\Validation\Rules\Password;

class AuthSystemUserUpdateRequest extends BaseRequest
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
            'password' => ['bail', 'nullable', 'string', 'confirmed', Password::min(6)],
            'password_current' => ['bail', 'nullable', 'current_password'],
            'picture' => ['bail', 'nullable'],
        ];
    }
}
