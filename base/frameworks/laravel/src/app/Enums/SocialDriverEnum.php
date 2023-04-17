<?php

namespace App\Enums;

enum SocialDriverEnum
{
    use BaseEnum;

    case Google;
    case Facebook;

    /* -------------------- */

    public function value(): string
    {
        return match($this) {
            self::Google => 'Google',
            self::Facebook => 'Facebook',
        };
    }
}
