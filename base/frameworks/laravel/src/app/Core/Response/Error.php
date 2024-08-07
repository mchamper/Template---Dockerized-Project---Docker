<?php

namespace App\Core\Response;

use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
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
        $name = $e->errorName ?? 'SystemDefaultError';
        $exception = class_basename($e);
        $code = $e instanceof ErrorEnumException ? $e->innerCode : 0;
        $validation = $e instanceof ValidationException ? $e->errors() : null;

        if (!is_numeric($status) || $status < 200 || $status > 599) {
            $status = 500;
        }

        if (!config('app.debug') && $e instanceof QueryException) {
            $message = 'Database error.';
        }

        $error = [
            'time' => floor((microtime(true) - LARAVEL_START) * 1000),
            'status' => $status,
            'message' => str_replace('`', '\'', $message),
            'body' => $body,
            'name' => $name,
            'exception' => $exception,
            'code' => $code,
            'validation' => $validation,
        ];

        if (in_array($name, config('logging.channels.discord.errors') ?: [])) {
            Log::channel('discord')->error('('. app()->environment() . ') /' . request()->path(), [
                'response' => $error,
            ]);
        }

        return $error;
    }

    public static function respond(Throwable $e, ?Response $response = null)
    {
        DB::rollBack();

        if (request()->wantsJson()) {
            $error = self::parse($e, $response);
            return response()->json($error, $error['status']);
        }

        return $response;
    }
}
