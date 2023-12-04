<?php

namespace App\Apis\Google;

use App\Core\Bases\BaseApi;
use Google;

abstract class GoogleApi extends BaseApi
{
    protected $_client;
    protected $_service;

    public function __construct(?string $subject = null)
    {
        parent::__construct(
            _retries: 3,
        );

        $jsonKey = json_decode(config('services.google.application_credentials'), true);

        $this->_client = new Google\Client();
        $this->_client->setAuthConfig($jsonKey);

        if ($subject) {
            $this->_client->setSubject($subject);
        }

        $this->_authorize();
    }

    /* -------------------- */

    protected function _authorize(bool $force = false): void
    {
        //
    }

    protected function _res($res)
    {
        return $res;
    }
}
