<?php

namespace App\Http\Requests\Role;

use App\Core\Bases\BaseRequest;

class RoleSyncPermissionRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public static function rules(?array $params = []): array
    {
        return [
            'permissions' => ['bail', 'required', 'array'],
            'permissions.*.id' => ['bail', 'required', 'exists:permissions,id'],
        ];
    }
}
