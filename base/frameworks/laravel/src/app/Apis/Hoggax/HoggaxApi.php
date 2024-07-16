<?php

namespace App\Apis\Hoggax;

use App\Core\Bases\BaseApi;
use GuzzleHttp\Client;

abstract class HoggaxApi extends BaseApi
{
    protected string $_url;
    protected string $_apiToken;

    public function __construct()
    {
        parent::__construct();

        $this->_url = config('services.hoggax_api.url');

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
        $this->_httpClientDefaultOptions = [];

        $this->_httpClientDefaultOptions = [
            'headers' => [
                'X-API-KEY' => 'TJNiBR8r+#G{5QvuB}Qf=(t8sErL.rf(',
            ],
        ];
    }

    protected function _res($res)
    {
        return $res;
    }
}
