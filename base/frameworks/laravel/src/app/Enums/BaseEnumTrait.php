<?php

namespace App\Enums;

use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Str;

trait BaseEnumTrait
{
    public static function tryFromName(string $name): ?static
    {
        foreach (static::cases() as $case) {
            if ($case->name === $name) {
                return $case;
            }
        }

        return null;
    }

    public function value(string $type = 'value', array $args = []): string
    {
        $method = '_get' . Str::studly($type);
        $methodEs = $method . 'Es';
        $methodEn = $method . 'En';

        switch (Lang::getLocale()) {
            case 'es': return $this->$methodEs($args);
            case 'en': return $this->$methodEn($args);
            default: return $this->$methodEs($args);
        }
    }
}
