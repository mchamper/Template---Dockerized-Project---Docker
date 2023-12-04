<?php

namespace App\Core\Response;

use App\Enums\ErrorEnum;

class ErrorEnumException extends ErrorException
{
    public $innerCode;

    public function __construct(
        public ErrorEnum $error,
        public array $args = [],
    ) {

        $errorValue = $error->data($args);
        $this->innerCode = $errorValue['code'];

        parent::__construct(
            message: $errorValue['message'],
            code: $errorValue['status'],
            errorName: $error->name,
        );
    }
}
