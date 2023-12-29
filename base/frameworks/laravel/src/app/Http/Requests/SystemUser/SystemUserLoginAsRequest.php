<?php

namespace App\Http\Requests\SystemUser;

use App\Core\Bases\BaseRequest;

class SystemUserLoginAsRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public static function rules(?array $params = []): array
    {
        return [
            'system_user_id' => ['bail', 'required', 'exists:system_users,id'],
        ];
    }
}
