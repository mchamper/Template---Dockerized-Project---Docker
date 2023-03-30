<?php

namespace App\Commons\Response;

use Symfony\Component\HttpKernel\Exception\HttpException;

class ErrorEnumException extends HttpException
{
    public function __construct(
        public ErrorEnum $error,
        public array $args = [],
    ) {

        parent::__construct(400);
    }
}
