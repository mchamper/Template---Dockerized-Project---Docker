<?php

namespace App\Core\Response;

use Exception;

class ErrorException extends Exception
{
    public $body;
    public $errorName;

    public function __construct(string $message = '', int $code = 400, ?array $body = null, ?string $errorName = 'DEFAULT_ERROR')
    {
        parent::__construct(
            message: $message,
            code: $code
        );

        $this->body = $body;
        $this->errorName = $errorName;
    }
}
