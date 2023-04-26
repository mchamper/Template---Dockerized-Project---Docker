<?php

namespace App\Commons\Response;

use Exception;

class ErrorEnumException extends Exception
{
    public function __construct(
        public ErrorEnum $error,
        public array $args = [],
    ) {

        parent::__construct(code: 400);
    }
}
