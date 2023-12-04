<?php

namespace App\Apis\Equifax;

use App\Commons\Response\ErrorException;
use Illuminate\Support\Str;

class EquifaxVerazApi extends EquifaxApi
{
    public function __construct()
    {
        parent::__construct();
    }

    /* -------------------- */

    private function _parseVerazProfile(array $item, bool $returnRaw = false)
    {
        $fullName = $item['VariablesDeSalida']['nombre'] ?? $item['variablesDeEntrada']['nombre'] ?? null;
        $names = explode(',', $fullName);

        return [
            'full_name_raw' => $fullName,
            'full_name' => trim(Str::title($names[1]) . ' ' . Str::title($names[0])),
            'names' => Str::title($names[1]),
            'first_name' => Str::title(explode(' ', $names[1])[0]),
            'last_name' => Str::title($names[0]),
            'document' => (int) ($item['VariablesDeSalida']['documento'] ?? null) ?: (int) ($item['variablesDeEntrada']['documento'] ?? null) ?: null,
            'gender' => $item['VariablesDeSalida']['sexo'] ?? $item['variablesDeEntrada']['sexo'] ?? null,
            'score' => (int) ($item['VariablesDeSalida']['score_veraz'] ?? null),
            'vars' => $item['VariablesDeSalida'],
            '_raw' => $returnRaw ? $item : null,
        ];
    }

    /**
     * @param array $persons
     * Ejemplo:
        [
            ['dni' => 12345678, 'gender' => 'X'],
            ['dni' => 12345678, 'gender' => 'X']
        ]
     *
     */
    public function getVerazProfiles(array $persons, bool $returnRaw = false): mixed
    {
        $res = $this->_try(function () use ($persons) {
            $applicants = [];

            foreach ($persons as $personKey => $person) {
                $dni = $person['dni'];
                $gender = $person['gender'];

                $applicants['primaryConsumer' . ($personKey > 0 ? $personKey : '')] = [
                    'personalInformation' => [
                        'entity' => [
                            'consumer' => [
                                'names' => [
                                    [
                                        'data' => [
                                            'documento' => $dni,
                                            'sexo' => $gender
                                        ]
                                    ]
                                ]
                            ]
                        ],
                        'productData' => [
                            'sector' => '04',
                            'billTo' => 'C26498',
                            'shipTo' => '0',
                            'formatReport' => 'T',
                            'producto' => 'experto',
                            'productName' => '',
                            'productOrch' => '',
                            'configuration' => 'MAPSocAvales',
                            'customer' => 'ARICMAPSOCAVAL',
                            'model' => 'MAPSocAvales'
                        ],
                        'clientConfig' => [
                            'clientTxId' => '0',
                            'clientReference' => ''
                        ]
                    ]
                ];
            }

            $input = [
                'applicants' => $applicants
            ];

            return $this->_send('post', '/business/integration-api-efx/v1/wserv', [
                'json' => $input,
            ]);
        }, function (ErrorException $e) {
            if ($e->body['status'] === 401) {
                $this->_authorize(true);
                return true;
            }
        });

        if ($res['clientImplementationStatus'] !== 'completed') {
            $this->_throw('El estado de la petición no es válido.');
        }

        $data = collect($res['SMARTS_CONSOLIDADO_RESPONSE'][0]['integrantes'])->map(function ($item) use ($returnRaw) {
            return $this->_parseVerazProfile($item, $returnRaw);
        });

        return $data;
    }

    /**
     * @param string $gender
     * Género de la persona a consultar. Ejemplo: "M/F/X/B".
     * Las opciones son Masculino (M) - Femenino (F) - Indefinido (I) - Sociedad (S) y No Binario (X) - Busqueda (B).
     */
    public function getVerazProfile(string|int $dni, string $gender, bool $returnRaw = false): mixed
    {
        return $this->getVerazProfiles([['dni' => $dni, 'gender' => $gender]], $returnRaw)[0] ?? null;
    }
}
