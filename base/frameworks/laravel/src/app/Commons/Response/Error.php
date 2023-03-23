<?php

namespace App\Commons\Response;

use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Error
{
    public static function parse(Throwable $e, ?Response $response)
    {
        $status = $response
            ? $response->getStatusCode()
            : ($e instanceof HttpException ? $e->getStatusCode() : $e->getCode());

        $message = $e->getMessage();
        $body = $e->body ?? null;
        $name = $e->errorName ?? 'LARAVEL_DEFAULT_ERROR';
        $exception = class_basename($e);
        $code = 0;
        $validation = $e instanceof ValidationException ? $e->errors() : null;
        $trace = $e->getTrace() ?? null;

        if ($status < 200 || $status > 599) {
            $status = 500;
        }

        $index = explode('.', $e->getMessage())[0];

        if ($error = json_decode(Lang::get('errors.' . $index))) {
            $status = $error->status;
            $message = $error->message . (explode('.', $e->getMessage())[1] ?? '');
            $name = $index;
            $code = $error->code;
        }

        return [
            'time' => round(microtime(true) - LARAVEL_START, 4),
            'status' => $status,
            'message' => $message,
            'body' => $body,
            'name' => $name,
            'exception' => $exception,
            'code' => $code,
            'validation' => $validation,
            'trace' => config('app.debug') ? $trace : null,
        ];
    }
}
