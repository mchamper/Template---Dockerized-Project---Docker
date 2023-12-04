<?php

namespace App\Apis\Colppy;
use App\Commons\Response\ErrorException;

class ColppyClientApi extends ColppyApi
{
    public function __construct()
    {
        parent::__construct();
    }

    /* -------------------- */

    public function getClients(int $page = 1, int $limit = 10)
    {
        $res = $this->_try(function () use ($page, $limit) {
            $input = [
                'service' => [
                    'provision' => 'Cliente',
                    'operacion' => 'listar_cliente',
                ],
                'parameters' => [
                    'start' => $page,
                    'limit' => $limit,
                    'order' => [
                        [
                            'field' => 'RazonSocial',
                            'dir' => 'ASC',
                        ],
                    ],
                ],
            ];

            $res = $this->_send('post', '', [
                'json' => $input,
            ]);

            return $this->_getResponse($res);
        }, function (ErrorException $e) {
            if ($e->body['status'] === 401) {
                $this->_authorize(true);
                return true;
            }
        });

        return $res['response']['data'];
    }

    public function getClient(int $clientId)
    {
        $res = $this->_try(function () use ($clientId) {
            $input = [
                'service' => [
                    'provision' => 'Cliente',
                    'operacion' => 'leer_cliente',
                ],
                'parameters' => [
                    'idCliente' => $clientId,
                ],
            ];

            $res = $this->_send('post', '', [
                'json' => $input,
            ]);

            return $this->_getResponse($res);
        }, function (ErrorException $e) {
            if ($e->body['status'] === 401) {
                $this->_authorize(true);
                return true;
            }
        });

        return $res['response']['data'];
    }

    public function getClientDataFromAfip(string $cuit)
    {
        $res = $this->_try(function () use ($cuit) {
            $input = [
                'service' => [
                    'provision' => 'Tercero',
                    'operacion' => 'obtener_datos_tercero_de_afip',
                ],
                'parameters' => [
                    'cuit' => $cuit,
                ],
            ];

            $res = $this->_send('post', '', [
                'json' => $input,
            ]);

            return $this->_getResponse($res);
        }, function (ErrorException $e) {
            if ($e->body['status'] === 401) {
                $this->_authorize(true);
                return true;
            }
        });

        return $res['response']['data'];
    }

    /* -------------------- */

    public function createClient(array $input)
    {
        $res = $this->_try(function () use ($input) {
            $input = [
                'service' => [
                    'provision' => 'Cliente',
                    'operacion' => 'alta_cliente',
                ],
                'parameters' => [
                    'info_general' => [
                        'idCliente' => '',
                        'idEmpresa' => $this->_companyId,
                        'NombreFantasia' => $input['name'],
                        'RazonSocial' => $input['business_name'],
                        'CUIT' => $input['cuit'] ?? '',
                        'dni' => $input['dni'] ?? '',
                        'DirPostalPais' => 'Argentina',
                        'Email' => $input['email'],
                    ],
                    'info_otra' => [
                        'Activo' => '1',
                        'FechaAlta' => now()->format('d-m-Y'),
                        'DirFiscalProvincia' => $input['province'],
                        'idCondicionPago' => 'Contado',
                        'idCondicionIva' => $input['iva_condition_id'],
                        'idPlanCuenta' => ''
                    ],
                ],
            ];

            $res = $this->_send('post', '', [
                'json' => $input,
            ]);

            return $this->_getResponse($res);
        }, function (ErrorException $e) {
            if ($e->body['status'] === 401) {
                $this->_authorize(true);
                return true;
            }
        });

        return $res['response']['data'];
    }
}
