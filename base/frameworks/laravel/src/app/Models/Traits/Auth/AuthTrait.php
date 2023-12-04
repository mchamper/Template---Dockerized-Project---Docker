<?php

namespace App\Models\Traits\Auth;

use Illuminate\Database\Eloquent\Casts\Attribute;

trait AuthTrait
{
    use AuthVerificationTrait;
    use AuthPasswordResetTrait;

    protected function password(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => !empty($value) ? bcrypt($value) : null,
        );
    }
}
