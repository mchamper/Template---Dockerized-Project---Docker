<?php

namespace App\Commons\Response;

class ErrorEnumException extends ErrorException
{
    public $innerCode;

    public function __construct(
        public ErrorEnum $error,
        public array $args = [],
    ) {

        $errorValue = $error->value($args);
        $this->innerCode = $errorValue['code'];

        parent::__construct(
            message: $errorValue['message'],
            code: $errorValue['status'],
            errorName: $error->name,
        );
    }
}
