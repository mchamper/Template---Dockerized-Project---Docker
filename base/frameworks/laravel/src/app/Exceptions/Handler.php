<?php

namespace App\Exceptions;

use App\Commons\Response\Error;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $e)
    {
        $rendered = parent::render($request, $e);
        $error = Error::parse($e, $rendered);

        if ($request->wantsJson()) {
            return response()->json([
                'error' => $error
            ], $error['status']);
        }

        return $rendered;
    }
}
