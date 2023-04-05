<?php

namespace App\Enums;

use Illuminate\Support\Facades\Lang;

enum SystemUserStatusEnum
{
    use BaseEnum;

    case Active;
    case Inactive;

    /* -------------------- */

    public function value(): array
    {
        return match($this) {
            self::Active => [
                'label' => match(Lang::getLocale()) {
                    'es' => 'Activo',
                    'en' => 'Active',
                },
                'color' => 'green',
            ],
            self::Inactive => [
                'label' => match(Lang::getLocale()) {
                    'es' => 'Inactivo',
                    'en' => 'Inactive',
                },
                'color' => '',
            ],
        };
    }
}
