<?php

namespace App\Apis\Colppy;

class ColppyChargeApi extends ColppyApi
{
    public function __construct()
    {
        parent::__construct();
    }

    /* -------------------- */

    public function getCharge($chargeId)
    {
        $res = $this->_try(function () use ($chargeId) {
            $input = [
                'service' => [
                    'provision' => 'Cliente',
                    'operacion' => 'AR_leer_fondos_pagos',
                ],
                'parameters' => [
                    'add' => 0,
                    'idCobro' => $chargeId,
                ],
            ];

            return $this->_send('post', '', [
                'json' => $input,
            ]);
        });

        $res = collect($res['response']['data'])
            ->map(function ($item) {
                return [
                    'importe' => (float) $item['importe'],
                    'idMedioCobro' => $item['idMedioCobro'],
                    'idPlanCuenta' => $item['idPlanCuenta'],
                ];
            })
            ->where('importe', '>', 0)
            ->first();

        // {
        //     "nroCheque": "",
        //     "0": "",
        //     "Banco": "",
        //     "1": "",
        //     "fechaValidez": "",
        //     "2": "0000-00-00",
        //     "importe": "100.00",
        //     "3": "100.00",
        //     "idMedioCobro": "Transferencia",
        //     "4": "3",
        //     "idPlanCuenta": "BBVA Cta Cte",
        //     "5": "111200",
        //     "Conciliado": "N",
        //     "6": "N",
        //     "VAD": "VAD"
        // },

        return $res;
    }
}
