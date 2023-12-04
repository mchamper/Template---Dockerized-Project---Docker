<?php

namespace App\Apis\Pipedrive;

use App\Core\Bases\BaseApi;
use Pipedrive\Client;

abstract class PipedriveApi extends BaseApi
{
    protected $_apiToken;
    protected $_client;

    public function __construct()
    {
        parent::__construct(
            _retries: 3,
        );

        $this->_apiToken = config('services.pipedrive.api_token');
        $this->_client = new Client(null, null, null, $this->_apiToken);

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
