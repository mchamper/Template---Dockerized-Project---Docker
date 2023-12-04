<?php

namespace App\Core\Bases;

use App\Core\Response\ErrorException;
use Carbon\Carbon;
use Closure;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Psr7\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Throwable;

abstract class BaseApi
{
    protected Client $_httpClient;
    protected array $_httpClientDefaultOptions = [];
    protected array $_credentials = [];
    public array $lastTryInfo = [];

    /* -------------------- */

    public function __construct(
        protected array $_retryCodeRange = [],
        protected array $_retryCodes = [],
        protected int $_retryCode = 0,
        protected int $_retries = 1,
        protected bool $_reauthorizeOnFirstError = true,
    ) { }

    /* -------------------- */

    abstract protected function _authorize(bool $force = false);
    abstract protected function _res($res);

    /* -------------------- */

    protected function _remember(string $key, Closure $callback, int $minutes = 60)
    {
        return Cache::remember(class_basename($this) . ':' . $key, Carbon::now()->addMinutes($minutes), $callback);
    }

    protected function _forget(string $key)
    {
        return Cache::forget(class_basename($this) . ':' . $key);
    }

    /* -------------------- */

    protected function _makeRequest(string $method, string $endpoint): Request
    {
        return new Request($method, $endpoint);
    }

    protected function _send(string $method, string $endpoint, array $options = [], string $responseType = 'json'): mixed
    {
        $res = $this->_httpClient->send(
            $this->_makeRequest($method, $endpoint),
            array_merge_recursive($this->_httpClientDefaultOptions, $options),
        )->getBody()->getContents();

        switch ($responseType) {
            case 'xml': return $this->_res($this->_parseResponseFromXml($res));
            case 'raw': return $res;

            default: return $this->_res($this->_parseResponseFromJson($res));
        }
    }

    private function _parseResponseFromJson($res): mixed
    {
        return json_decode($res, true);
    }

    private function _parseResponseFromXml($res): mixed
    {
        $res = preg_replace("/(<\/?)(\w+):([^>]*>)/", "$1$2$3", $res);
        $res = simplexml_load_string($res);
        $res = json_encode($res);
        $res = json_decode($res, true);

        return $res;
    }

    /* -------------------- */

    private function _delay(float $seconds)
    {
        usleep($seconds * 1000000);
    }

    /* -------------------- */

    protected function _throw(ClientException|Throwable|string $e, int $tries = 1, int $code = 0, bool $return = false)
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
            'info' => $this->lastTryInfo,
        ], Str::upper(Str::snake($apiName)) . '_DEFAULT_ERROR');

        if ($return) {
            return $newException;
        }

        throw $newException;
    }

    /* -------------------- */

    private function _canRetry(Throwable $e): bool
    {
        if ($this->_retries > 1) {
            return true;
        }

        $status = $this->_throw($e, return: true)->body['status'] ?? null;

        if (!empty($this->_retryCodeRange)) {
            if ($status >= $this->_retryCodeRange[0] && $status <= $this->_retryCodeRange[1]) {
                return true;
            }
        }

        if (!empty($this->_retryCodes)) {
            if (in_array($status, $this->_retryCodes)) {
                return true;
            }
        }

        if ($this->_retryCode !== 0) {
            if ($status === $this->_retryCode) {
                return true;
            }
        }

        return false;
    }

    protected function _try(Closure $callback, int $retries = 0, float $retryDelay = 1, bool $isAuthorize = false)
    {
        $res = null;
        $tries = 0;
        $retries = $retries > 0 ? $retries : $this->_retries;

        if (!$isAuthorize) {
            $this->lastTryInfo = [];
        }

        do {
            $tries++;

            try {
                $res = call_user_func($callback);

                $this->lastTryInfo[] = [
                    'try' => $tries,
                    'callback' => $isAuthorize ? 'Authorize' : 'Method',
                    'status' => 'Success',
                ];
            } catch (Throwable $e) {
                $this->lastTryInfo[] = [
                    'try' => $tries,
                    'callback' => $isAuthorize ? 'Authorize' : 'Method',
                    'status' => 'Error',
                ];

                if ($tries === $retries || !$this->_canRetry($e)) {
                    $this->_throw($e, tries: $tries);
                }

                if ($tries === 1 && $this->_reauthorizeOnFirstError && !$isAuthorize) {
                    $this->_delay(1);
                    $this->_authorize(true);
                }

                $this->_delay($retryDelay + $tries);
            }
        } while (!$res && $tries < $retries);

        return $res;
    }

    protected function _tryOne(Closure $callback)
    {
        return $this->_try($callback, 1, 0);
    }

    protected function _tryAuth(Closure $callback, int $retries = 1, float $retryDelay = 1)
    {
        return $this->_try($callback, $retries, $retryDelay, true);
    }
}
