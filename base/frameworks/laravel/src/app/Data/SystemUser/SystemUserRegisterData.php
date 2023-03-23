<?php

namespace App\Data\SystemUser;

use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rules\File;
use Illuminate\Validation\Rules\Password;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class SystemUserRegisterData extends Data
{
    public function __construct(
        public string $first_name,
        public string $last_name,
        public string $email,
        public string $password,
        // public ?UploadedFile $picture,
    ) { }

    /* -------------------- */

    public static function rules(ValidationContext $context): array
    {
        return [
            'first_name' => ['bail', 'required', 'string'],
            'last_name' => ['bail', 'required', 'string'],
            'email' => ['bail', 'required', 'email', 'unique:system_users,email'],
            'password' => ['bail', 'required', 'string', 'confirmed', Password::min(6)],
            // 'picture' => ['bail', 'nullable', 'file', File::types(['jpg', 'png', 'webp'])->max(1024)],
        ];
    }
}
