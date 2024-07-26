<?php

namespace App\Http\Requests\Role;

use App\Core\Bases\BaseRequest;

class RoleSyncUserRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public static function rules(?array $params = []): array
    {
        return [
            'users' => ['bail', 'nullable', 'array'],
            'users.*.id' => ['bail', 'required', "exists:{$params['userTable']},id"],
        ];
    }
}
