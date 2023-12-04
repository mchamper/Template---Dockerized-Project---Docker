<?php

namespace App\Enums;

use App\Core\Bases\BaseEnum;

enum SocialDriverEnum
{
    use BaseEnum;

    case Google;
    case Facebook;

    /* -------------------- */

    public function data(): array
    {
        return match($this) {
            self::Google => [
                'label' => 'Google',
                'color' => '#d04b32',
            ],
            self::Facebook => [
                'label' => 'Facebook',
                'color' => '#3b5998',
            ],
        };
    }
}
