<?php

namespace App\Commons\Response;

use Exception;
use Illuminate\Support\Facades\Lang;
use Illuminate\Validation\ValidationException;
use Throwable;

class Error
{
    public static function parse(Throwable $e, $rendered = null)
    {
        $status = $rendered ? $rendered->getStatusCode() : $e->getCode();
        $code = 0;
        $message = $e->getMessage();
        $type = 'Uncatched';

        if ($status === 500 && method_exists($e, 'getCode')) {
            $status = $e->getCode() ?? 500;
        }

        if ($status < 200 || $status > 599) {
            $status = 500;
        }

        if ($e instanceof ValidationException) {
            $status = $e->status;
            $validation = $e->errors();
        }

        $errorIndex = explode('.', $e->getMessage())[0];

        if ($error = json_decode(Lang::get('errors.' . $errorIndex))) {
            $status = $error->status;
            $code = $error->code;
            $message = $error->message . (explode('.', $e->getMessage())[1] ?? '');
            $type = $errorIndex;
        }

        return [
            'status' => $status,
            'code' => $code,
            'message' => $message,
            'type' => $type,
            'errors' => $validation ?? null,
        ];
    }
}
