<?php

namespace App\Commons\Response;

use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class Error
{
    public static function parse(Throwable $e, ?Response $response = null)
    {
        $status = $response
            ? $response->getStatusCode()
            : $e->getCode();

        $status = $response->getStatusCode() === 500 ? $e->getCode() : $status;

        $message = $e->getMessage();
        $body = $e->body ?? null;
        $name = $e->errorName ?? 'LARAVEL_DEFAULT_ERROR';
        $exception = class_basename($e);
        $code = 0;
        $validation = $e instanceof ValidationException ? $e->errors() : null;

        if ($status < 200 || $status > 599) {
            $status = 500;
        }

        if ($e instanceof ErrorEnumException) {
            $errorValue = $e->error->value($e->args);

            $status = $errorValue['status'] ?? $status;
            $message = $errorValue['message'];
            $name = $e->error->name;
            $code = $errorValue['code'] ?? 0;
        }

        $error = [
            'time' => round(microtime(true) - LARAVEL_START, 4),
            'status' => $status,
            'message' => $message,
            'body' => $body,
            'name' => $name,
            'exception' => $exception,
            'code' => $code,
            'validation' => $validation,
        ];

        return $error;
    }
}
