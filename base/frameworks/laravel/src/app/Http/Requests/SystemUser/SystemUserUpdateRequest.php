<?php

namespace App\Http\Requests\SystemUser;

use App\Http\Requests\BaseRequest;

class SystemUserUpdateRequest extends BaseRequest
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
            'picture' => ['bail', 'nullable'],
        ];
    }
}
