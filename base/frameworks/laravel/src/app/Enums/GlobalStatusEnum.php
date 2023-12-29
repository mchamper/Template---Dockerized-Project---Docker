<?php

namespace App\Enums;

use App\Core\Bases\BaseEnum;
use Illuminate\Support\Facades\Lang;

enum GlobalStatusEnum
{
    use BaseEnum;

    case Active;
    case Inactive;

    /* -------------------- */

    public function data(): array
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
                'color' => 'default',
            ],
        };
    }
}
