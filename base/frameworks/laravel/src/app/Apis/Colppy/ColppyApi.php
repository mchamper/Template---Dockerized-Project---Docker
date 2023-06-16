<?php

namespace App\Apis\Colppy;

use App\Apis\BaseApi;
use GuzzleHttp\Client;

abstract class ColppyApi extends BaseApi
{
    protected string $_url;
    protected string $_authUser;
    protected string $_authPass;
    protected string $_user;
    protected string $_pass;
    protected string $_companyId;
    protected string $_apiToken;

    public function __construct()
    {
        parent::__construct(
            _maxTries: 1,
            _retryAll: true,
        );

        $this->_url = config('services.colppy_api.url');
        $this->_authUser = config('services.colppy_api.auth_user');
        $this->_authPass = config('services.colppy_api.auth_pass');
        $this->_user = config('services.colppy_api.user');
        $this->_pass = config('services.colppy_api.pass');
        $this->_companyId = config('services.colppy_api.company_id');

        $this->_authPass = md5($this->_authPass);
        $this->_pass = md5($this->_pass);

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

        if ($force) {
            $this->_forget('apiToken');
        }

        $this->_apiToken = $this->_remember('apiToken', function () {
            return $this->_tryOne(function () {
                $input = [
                    'auth' => [
                        'usuario' => $this->_authUser,
                        'password' => $this->_authPass,
                    ],
                    'service' => [
                        'provision' => 'Usuario',
                        'operacion' => 'iniciar_sesion',
                    ],
                    'parameters' => [
                        'usuario' => $this->_user,
                        'password' => $this->_pass,
                    ],
                ];

                $res = $this->_send('post', '', [
                    'json' => $input,
                ]);

                return $this->_getResponse($res)['response']['data']['claveSesion'];
            });
        });

        $this->_httpClientDefaultOptions = [
            'json' => [
                'auth' => [
                    'usuario' => $this->_authUser,
                    'password' => $this->_authPass,
                ],
                'parameters' => [
                    'sesion' => [
                        'usuario' => $this->_user,
                        'claveSesion' => $this->_apiToken,
                    ],
                    'idEmpresa' => $this->_companyId,
                ],
            ],
        ];
    }

    protected function _getResponse($res)
    {
        $code = 0;

        if (($res['result']['mensaje'] ?? null) === 'La sesion no es válida.') $code = 401;
        if (($res['result']['mensaje'] ?? null) === 'Ocurrió un error durante la ejecución del servicio') $code = 401;

        if (empty($res['response'])) {
            $this->_throw($res['result']['mensaje'] ?? 'Formato de respuesta inválido.', code: $code);
        }

        if ($res['response']['success'] === false) {
            $this->_throw($res['response']['message'] ?? 'Error.', code: $code);
        }

        return $res;
    }
}
