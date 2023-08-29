<?php

namespace App\Apis;

use App\Commons\Response\ErrorException;
use Carbon\Carbon;
use Closure;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Psr7\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

abstract class BaseApi
{
    protected Client $_httpClient;
    protected array $_httpClientDefaultOptions = [];
    protected array $_credentials = [];

    /* -------------------- */

    public function __construct(
        protected bool $_retryAll = false,
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
            array_merge_recursive($this->_httpClientDefaultOptions, $options),
        )->getBody()->getContents(), true);
    }

    /* -------------------- */

    protected function _throw(ClientException|Throwable|string $e, int $tries = 1, bool $return = false, int $code = 0)
    {
        $apiName = class_basename($this);
        $message = 'Ha ocurrido un error con la API "' . $apiName . '"';
        $body = null;
        $exceptionMessage = null;
        $exceptionCode = $e instanceof Throwable ? (int) $e->getCode() : $code;

        if ($e instanceof ClientException) {
            $body = json_decode((string) $e->getResponse()->getBody(), true);
            $exceptionMessage = $e->getMessage();
        }
        else if ($e instanceof Throwable) {
            $exceptionMessage = $e->getMessage();
        }
        else {
            $exceptionMessage = $e;
        }

        if (Str::isJson($exceptionMessage)) {
            $body = json_decode($exceptionMessage);
        } else {
            if (Str::startsWith($exceptionMessage, $message . ': ')) {
                $exceptionMessage = Str::replace($message . ': ', '', $exceptionMessage);
            }

            $message .= ': ' . $exceptionMessage;
        }

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
        if ($this->_retryAll) {
            return true;
        }

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

    protected function _try(Closure $callback, ?Closure $onError = null, int $maxTries = 0, float $delay = 2)
    {
        $sleep = $delay * 1000000;

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
                        $maxTries++;
                        usleep(1000000);

                        continue;
                    }
                }

                if ($tries === $maxTries || !$this->_canTry($e)) {
                    $this->_throw($e, tries: $tries);
                }

                usleep($sleep + ($tries * 1000000));
            }
        } while ($retryError && $tries < $maxTries);

        return $res;
    }

    protected function _tryOne(Closure $callback, ?Closure $onError = null, float $delay = 0)
    {
        return $this->_try($callback, $onError, 1, $delay);
    }
}
