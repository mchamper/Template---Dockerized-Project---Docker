<?php

namespace App\Apis\HipotecarioSeguros;

use App\Core\Bases\BaseApi;
use App\Apis\HipotecarioSeguros\Utils\Encrypter;
use GuzzleHttp\Client;

abstract class HipotecarioSegurosApi extends BaseApi
{
    protected string $_urlLogin;
    protected string $_url;
    protected string $_user;
    protected string $_pass;
    protected string $_organizationId;
    protected string $_apiToken;
    protected Encrypter $_crypt;

    public function __construct()
    {
        parent::__construct(
            _retries: 3,
        );

        $this->_urlLogin = config('services.hipotecario_seguros_api.url_login');
        $this->_url = config('services.hipotecario_seguros_api.url');
        $this->_user = config('services.hipotecario_seguros_api.user');
        $this->_pass = config('services.hipotecario_seguros_api.pass');
        $this->_organizationId = config('services.hipotecario_seguros_api.organization_id');

        $this->_httpClient = new Client([
            'base_uri' => $this->_url,
            'debug' => false,
            'timeout' => 30.0,
        ]);

        $this->_crypt = new Encrypter();

        if (!app()->environment('local')) {
            $this->_authorize();
        }
    }

    /* -------------------- */

    protected function _authorize(bool $force = false): void
    {
        $this->_httpClientDefaultOptions = [];

        if ($force) {
            $this->_forget('apiToken');
        }

        $this->_apiToken = $this->_remember('apiToken', function () {
            return $this->_tryAuth(function () {
                $data = '<?xml version="1.0" encoding="UTF-8"?>
                    <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:partner.soap.sforce.com">
                    <SOAP-ENV:Header>
                        <ns1:LoginScopeHeader>
                            <ns1:organizationId>' . $this->_organizationId . '</ns1:organizationId>
                        </ns1:LoginScopeHeader>
                    </SOAP-ENV:Header>
                    <SOAP-ENV:Body>
                        <ns1:login>
                            <ns1:username>' . $this->_user . '</ns1:username>
                            <ns1:password>' . $this->_pass . '</ns1:password>
                        </ns1:login>
                    </SOAP-ENV:Body>
                    </SOAP-ENV:Envelope>';

                $res = $this->_send('post', $this->_urlLogin . '/VentaDeProducto/services/Soap/u/52.0', [
                    'headers' => [
                        'Content-Type' => 'text/xml',
                        'SOAPAction' => 'any',
                    ],
                    'body' => $data,
                ], 'xml');

                return $res['soapenvBody']['loginResponse']['result']['sessionId'];
            });
        });

        $this->_httpClientDefaultOptions = [
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $this->_apiToken,
            ],
        ];
    }

    protected function _res($res)
    {
        return $res;
    }
}
