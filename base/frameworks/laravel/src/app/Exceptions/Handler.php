<?php

namespace App\Exceptions;

use App\Core\Redis\RedisService;
use App\Core\Response\Error;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\DB;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $e)
    {
        DB::rollBack();
        RedisService::clear();

        $rendered = parent::render($request, $e);

        if ($request->wantsJson()) {
            $error = Error::parse($e, $rendered);
            return response()->json($error, $error['status']);
        }

        return $rendered;
    }
}
