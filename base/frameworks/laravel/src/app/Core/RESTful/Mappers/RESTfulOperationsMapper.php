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
        '!like' => 'not like',
    ];

    public static function get(String $operation) {
        return static::$_operations[$operation];
    }
}
