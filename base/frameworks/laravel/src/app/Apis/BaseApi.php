<?php

namespace App\Apis;

use App\Commons\Response\ErrorException;
use Illuminate\Support\Str;
use Throwable;

abstract class BaseApi
{
    protected function _throw(Throwable|string $e, int $code = 500, int $tries = 1, bool $return = false)
    {
        $apiName = class_basename($this);
        $message = 'Ha ocurrido un error con la API "' . $apiName . '"';
        $body = null;
        $exceptionMessage = $e instanceof Throwable ? $e->getMessage() : $e;

        Str::isJson($exceptionMessage)
            ? $body = json_decode($exceptionMessage, true)
            : $message .= ': ' . $exceptionMessage;

        $newException = new ErrorException($message, $code, [
            'tries' => $tries,
            '_raw' => $body,
        ], Str::upper(Str::snake($apiName)) . '_DEFAULT_ERROR');

        if ($return) {
            return $newException;
        }

        throw $newException;
    }

    protected function _try(callable $callable, int $maxTries = 3, int $sleep = 3)
    {
        $tries = 0;

        do {
            $tries++;
            $retryError = false;

            try {
                $res = call_user_func($callable);
            } catch (Throwable $e) {
                $retryError = true;

                if ($tries === $maxTries) {
                    $this->_throw($e, tries: $tries);
                }

                sleep($sleep);
            }
        } while ($retryError && $tries < $maxTries);

        return $res;
    }
}
