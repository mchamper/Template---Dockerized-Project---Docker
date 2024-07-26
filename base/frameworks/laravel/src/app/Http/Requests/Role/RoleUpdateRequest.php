<?php

namespace App\Http\Requests\Role;

use App\Core\Bases\BaseRequest;

class RoleUpdateRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public static function rules(?array $params = []): array
    {
        return [
            'name' => ['bail', 'required', 'alpha'],
        ];
    }
}
