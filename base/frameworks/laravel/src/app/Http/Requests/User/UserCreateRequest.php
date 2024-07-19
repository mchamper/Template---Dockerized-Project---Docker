<?php

namespace App\Http\Requests\User;

use App\Core\Bases\BaseRequest;
use Illuminate\Validation\Rules\Password;

class UserCreateRequest extends BaseRequest
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
            'email' => ['bail', 'required', 'email', "unique:{$params['userTable']},email"],
            'password_input_type' => ['bail', 'required', 'in:random,manual'],
            'password' => ['bail', 'required_if:password_input_type,manual', 'string', 'confirmed', Password::min(6)],
            'require_email_verification' => ['bail', 'nullable', 'boolean'],
        ];
    }
}
