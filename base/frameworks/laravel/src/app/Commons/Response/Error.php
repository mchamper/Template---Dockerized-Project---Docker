<?php

namespace App\Commons\Response;

use Illuminate\Support\Facades\Log;
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
        $code = $e instanceof ErrorEnumException ? $e->innerCode : 0;
        $validation = $e instanceof ValidationException ? $e->errors() : null;

        if ($status < 200 || $status > 599) {
            $status = 500;
        }

        $error = [
            'time' => round(microtime(true) - LARAVEL_START, 4),
            'status' => $status,
            'message' => str_replace('`', '\'', $message),
            'body' => $body,
            'name' => $name,
            'exception' => $exception,
            'code' => $code,
            'validation' => $validation,
        ];

        if (in_array($name, config('logging.channels.discord.errors'))) {
            Log::channel('discord')->error('('. app()->environment() . ') /' . request()->path(), [
                'response' => $error,
            ]);
        }

        return $error;
    }
}
