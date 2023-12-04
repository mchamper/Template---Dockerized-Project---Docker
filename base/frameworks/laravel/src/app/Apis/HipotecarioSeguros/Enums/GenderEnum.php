<?php

namespace App\Apis\HipotecarioSeguros\Enums;

use Illuminate\Support\Facades\Lang;

enum GenderEnum: string
{
    case Male = 'MASCULINO';
    case Female = 'FEMENINO';

    /* -------------------- */

    public function value(): array
    {
        return match($this) {
            self::Male => [
                'label' => match(Lang::getLocale()) {
                    'es' => 'Masculino',
                    'en' => 'Male',
                },
            ],
            self::Female => [
                'label' => match(Lang::getLocale()) {
                    'es' => 'Femenino',
                    'en' => 'Female',
                },
            ],
        };
    }
}
