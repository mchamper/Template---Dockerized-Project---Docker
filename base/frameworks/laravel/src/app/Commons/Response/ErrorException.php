<?php

namespace App\Commons\Response;

use Symfony\Component\HttpKernel\Exception\HttpException;

class ErrorException extends HttpException
{
    public $body;
    public $errorName;

    public function __construct(string $message = '', int $code = 400, ?array $body = null, ?string $errorName = 'DEFAULT_ERROR')
    {
        parent::__construct($code, $message);

        $this->body = $body;
        $this->errorName = $errorName;
    }
}
