<?php

namespace App\Enums;

trait BaseEnum
{
    public static function all(): array
    {
        $values = [];

        foreach (static::cases() as $case) {
            $values[] = [
                'name' => $case->name,
                'value' => $case->value(),
            ];
        }

        return $values;
    }

    public static function names(): array
    {
        $names = [];

        foreach (static::cases() as $case) {
            $names[] = $case->name;
        }

        return $names;
    }

    public static function tryFromName(string $name): ?static
    {
        foreach (static::cases() as $case) {
            if ($case->name === $name) {
                return $case;
            }
        }

        return null;
    }

    public function is($enum): bool
    {
        return $this === $enum;
    }

    public function in(array $enums): bool
    {
        return in_array($this, $enums);
    }
}
