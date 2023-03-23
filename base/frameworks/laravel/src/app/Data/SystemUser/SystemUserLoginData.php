<?php

namespace App\Data\SystemUser;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class SystemUserLoginData extends Data
{
    public function __construct(
      public string $email,
      public string $password,
      public ?bool $remember_me,
    ) { }

    /* -------------------- */

    public static function rules(ValidationContext $context): array
    {
        return [
            'email' => ['bail', 'required', 'email'],
            'password' => ['bail', 'required', 'string'],
            'remember_me' => ['bail', 'nullable', 'boolean'],
        ];
    }
}
