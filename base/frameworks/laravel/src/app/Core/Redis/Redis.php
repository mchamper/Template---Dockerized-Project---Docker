<?php

namespace App\Core\Redis;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Redis as BaseRedis;

class Redis extends BaseRedis
{
    public static function get(string $key)
    {
        return json_decode(parent::get(':' . $key), true);
    }

    public static function find(string $key)
    {
        if (!$value = self::get($key)) {
            throw new ModelNotFoundException('No se ha encontrado ningún valor para la entidad solicitada.');
        }

        return $value;
    }

    public static function set(string $key, $value)
    {
        return parent::set(':' . $key, json_encode($value));
    }
}
