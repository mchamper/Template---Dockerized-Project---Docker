<?php

namespace App\Apis;

use App\Commons\Response\ErrorException;
use Carbon\Carbon;
use Closure;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Psr7\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Throwable;

abstract class BaseApi
{
    protected Client $_httpClient;
    protected array $_httpClientDefaultOptions = [];
    protected array $_credentials = [];

    /* -------------------- */

    public function __construct(
        protected array $_retryStatusRange = [],
        protected array $_retryStatuses = [],
        protected int $_retryStatus = 0,
        protected int $_maxTries = 1,
    ) { }

    /* -------------------- */

    protected function _remember(string $key, Closure $callback, int $minutes = 60)
    {
        return Cache::remember(class_basename($this) . '::' . $key, Carbon::now()->addMinutes($minutes), $callback);
    }

    protected function _forget(string $key)
    {
        return Cache::forget(class_basename($this) . '::' . $key);
    }

    /* -------------------- */

    protected function _makeRequest(string $method, string $endpoint): Request
    {
        return new Request($method, $endpoint);
    }

    protected function _send(string $method, string $endpoint, array $options = []): mixed
    {
        return json_decode($this->_httpClient->send(
            $this->_makeRequest($method, $endpoint),
            array_merge($this->_httpClientDefaultOptions, $options),
        )->getBody()->getContents(), true);
    }

    /* -------------------- */

    protected function _throw(GuzzleException|Throwable|string $e, int $tries = 1, bool $return = false)
    {
        $apiName = class_basename($this);
        $message = 'Ha ocurrido un error con la API "' . $apiName . '"';
        $body = null;
        $exceptionMessage = null;
        $exceptionCode = $e instanceof Throwable ? (int) $e->getCode() : 0;

        if ($e instanceof GuzzleException) {
            $body = json_decode((string) $e->getResponse()->getBody(), true);
            $exceptionMessage = $e->getMessage();
        }
        else if ($e instanceof Throwable) {
            $exceptionMessage = $e->getMessage();
        }
        else {
            $exceptionMessage = $e;
        }

        Str::isJson($exceptionMessage)
            ? $body = json_decode($exceptionMessage)
            : $message .= ': ' . $exceptionMessage;

        $newException = new ErrorException($message, $exceptionCode ?: 500, [
            'tries' => $tries,
            'status' => $exceptionCode,
            'message' => $exceptionMessage,
            'content' => $body,
        ], Str::upper(Str::snake($apiName)) . '_DEFAULT_ERROR');

        if ($return) {
            return $newException;
        }

        throw $newException;
    }

    /* -------------------- */

    private function _canTry(Throwable $e): bool
    {
        $status = $this->_throw($e, return: true)->body['status'] ?? null;

        if (!empty($this->_retryStatusRange)) {
            if ($status >= $this->_retryStatusRange[0] && $status <= $this->_retryStatusRange[1]) {
                return true;
            }
        }

        if (!empty($this->_retryStatuses)) {
            if (in_array($status, $this->_retryStatuses)) {
                return true;
            }
        }

        if ($this->_retryStatus !== 0) {
            if ($status === $this->_retryStatus) {
                return true;
            }
        }


        return false;
    }

    protected function _try(Closure $callback, ?Closure $onError = null, int $maxTries = 0, int $sleep = 2)
    {
        $tries = 0;
        $maxTries = $maxTries > 0 ? $maxTries : $this->_maxTries;

        do {
            $tries++;
            $retryError = false;

            try {
                $res = call_user_func($callback);
            } catch (Throwable $e) {
                $retryError = true;

                if ($tries === 1 && $onError) {
                    if (call_user_func($onError, $this->_throw($e, tries: $tries, return: true)) === true) {
                        sleep(1);
                        continue;
                    }
                }

                if ($tries === $maxTries || !$this->_canTry($e)) {
                    $this->_throw($e, tries: $tries);
                }

                sleep($sleep + $tries);
            }
        } while ($retryError && $tries < $maxTries);

        return $res;
    }

    protected function _tryOne(Closure $callback, ?Closure $onError = null)
    {
        return $this->_try($callback, $onError, 1, 0);
    }
}
