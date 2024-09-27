<?php

namespace App\Core\RESTful\Mappers;

class RESTfulOperationsMapper
{
    private static $_operations = [
        'eq' => '=',
        '!eq' => '!=',
        '<' => '<',
        '<eq' => '<=',
        '>' => '>',
        '>eq' => '>=',
        'like' => 'like',
        'ilike' => 'ilike',
        '!like' => 'not like',
        '!ilike' => 'not ilike',
    ];

    public static function get(String $operation) {
        return static::$_operations[$operation];
    }
}
