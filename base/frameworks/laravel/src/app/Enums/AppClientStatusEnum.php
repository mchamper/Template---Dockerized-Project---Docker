<?php

namespace App\Enums;

use Illuminate\Support\Facades\Lang;

enum AppClientStatusEnum
{
    use BaseEnum;

    case Active;
    case Inactive;

    /* -------------------- */

    public function value(array $args): string
    {
        return match($this) {
            self::Active => match(Lang::getLocale()) {
                'es' => 'Activo',
                'en' => 'Active',
            },
            self::Inactive => match(Lang::getLocale()) {
                'es' => 'Inactivo',
                'en' => 'Inactive',
            },
        };
    }
}
