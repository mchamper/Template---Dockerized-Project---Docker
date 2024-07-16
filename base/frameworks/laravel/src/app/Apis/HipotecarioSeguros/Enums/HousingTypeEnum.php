<?php

namespace App\Apis\HipotecarioSeguros\Enums;

use Illuminate\Support\Facades\Lang;

enum HousingTypeEnum: string
{
    case PrivateNeighborhood = 'BARRIO_PRIVADO';
    case House = 'CASA';
    case Department = 'DEPARTAMENTO';

    /* -------------------- */

    public function value(): array
    {
        return match($this) {
            self::PrivateNeighborhood => [
                'label' => match(Lang::getLocale()) {
                    'es' => 'Barrio privado',
                    'en' => 'Private neighborhood',
                },
            ],
            self::House => [
                'label' => match(Lang::getLocale()) {
                    'es' => 'Casa',
                    'en' => 'House',
                },
            ],
            self::Department => [
                'label' => match(Lang::getLocale()) {
                    'es' => 'Departamento',
                    'en' => 'Department',
                },
            ],
        };
    }
}
