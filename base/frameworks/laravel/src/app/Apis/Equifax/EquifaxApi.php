<?php

namespace App\Apis\Equifax;

use App\Apis\BaseApi;
use GuzzleHttp\Client;

abstract class EquifaxApi extends BaseApi
{
    protected string $_url;
    protected string $_clientId;
    protected string $_clientSecret;
    protected string $_apiToken;

    public function __construct()
    {
        parent::__construct(
            _maxTries: 3,
            _retryStatusRange: [500, 599],
            _retryStatuses: [400],
        );

        $this->_url = config('services.equifax.url');
        $this->_clientId = config('services.equifax.client_id');
        $this->_clientSecret = config('services.equifax.client_secret');

        $this->_httpClient = new Client([
            'base_uri' => $this->_url,
            'debug' => false,
            'timeout' => 30.0,
        ]);

        $this->_authorize();
    }

    /* -------------------- */

    protected function _authorize(bool $force = false): void
    {
        if ($force) {
            $this->_forget('apiToken');
        }

        $this->_apiToken = $this->_remember('apiToken', function () {
            return $this->_tryOne(function () {
                return $this->_send('post', '/v2/oauth/token', [
                    'headers' => [
                        'Authorization' => 'Basic ' . base64_encode($this->_clientId . ':' . $this->_clientSecret),
                    ],
                    'form_params' => [
                        'grant_type' => 'client_credentials'
                    ],
                ])['access_token'];
            });
        });

        $this->_httpClientDefaultOptions = [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->_apiToken,
            ],
        ];
    }
}
