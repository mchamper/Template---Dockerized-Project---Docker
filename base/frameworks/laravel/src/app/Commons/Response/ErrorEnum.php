<?php

namespace App\Commons\Response;

use Illuminate\Support\Facades\Lang;

enum ErrorEnum: string
{
    case PIPEDRIVE_WEBHOOK_DATA_SOURCE_CHECK_ERROR = '1|400';

    /* -------------------- */

    public static function tryFromName(string $name): ?static
    {
        foreach (static::cases() as $case) {
            if ($case->name === $name) {
                return $case;
            }
        }

        return null;
    }

    /* -------------------- */

    public function message(array $args): string
    {
        switch (Lang::getLocale()) {
            case 'es': return $this->_getMessageEs($args);
            case 'en': return $this->_getMessageEn($args);
        }
    }

    private function _getMessageEs(array $args): string
    {
        return match($this) {
            ErrorEnum::PIPEDRIVE_WEBHOOK_DATA_SOURCE_CHECK_ERROR => 'Solo se permiten eventos provenientes de la web de Pipedrive (proveniente desde "' . $args[0] . '").',
        };
    }

    private function _getMessageEn(array $args): string
    {
        return match($this) {
            ErrorEnum::PIPEDRIVE_WEBHOOK_DATA_SOURCE_CHECK_ERROR => 'Only events coming from the Pipedrive website (coming from "' . $args[0] . '").',
        };
    }
}
