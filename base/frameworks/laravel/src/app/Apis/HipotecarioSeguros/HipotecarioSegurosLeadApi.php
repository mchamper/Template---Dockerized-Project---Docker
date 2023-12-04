<?php

namespace App\Apis\HipotecarioSeguros;
use App\Apis\HipotecarioSeguros\Mocks\HipotecarioSegurosLeadApiMock;
use App\Apis\HipotecarioSeguros\Requests\GenerateLeadRequest;
use App\Enums\HousingTypeEnum;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;

class HipotecarioSegurosLeadApi extends HipotecarioSegurosApi
{
    public function __construct()
    {
        parent::__construct();
    }

    /* -------------------- */

    public function getProductosEnlatados(array $params = [])
    {
        if (app()->environment('local')) {
            $res = HipotecarioSegurosLeadApiMock::getProductosEnlatados();
        } else {
            $res = $this->_try(function () use ($params) {
                return $this->_send('get', '/services/apexrest/ProductosEnlatados', [
                    'query' => $params,
                ]);
            });
        }

        return $res['productos'];
    }

    public function getProductosEnlatado(string $productId)
    {
        return $this->getProductosEnlatados(['product' => $productId])[0] ?? null;
    }

    /* -------------------- */

    public function generateLead(array $input)
    {
        $validated = Validator::make($input, GenerateLeadRequest::rules())->validate();

        $tipoViviendaId = '';
        $paymentMethodId = '';
        $paymentOriginId = '';

        switch ($validated['tipoVivienda']) {
            case HousingTypeEnum::PrivateNeighborhood->value: $tipoViviendaId = '1'; break;
            case HousingTypeEnum::House->value: $tipoViviendaId = '2'; break;
            case HousingTypeEnum::Department->value: $tipoViviendaId = '3'; break;
        }

        switch ($validated['paymentMethod']) {
            case 'CBU': $paymentMethodId = '4'; break;
            case 'TC': $paymentMethodId = '2'; break;
            default: $paymentMethodId = '1'; break;
        }

        switch ($validated['paymentOrigin']) {
            case 'CBU': $paymentOriginId = '01'; break;
            case 'VISA': $paymentOriginId = '05'; break;
            case 'MASTERCARD': $paymentOriginId = '04'; break;
            default: $paymentOriginId = 'A'; break;
        }

        $domicilio = explode(',', preg_replace('/\s/', ' ', $validated['domicilio'])) ?? [];
        $calle = explode('-', $domicilio[0]) ?? [];

        $input = [
            'FirstName' => $validated['firstName'],
            'LastName' => $validated['lastName'],
            'Email' => $validated['email'],
            'Phone' => $validated['phone'],
            'DNI__c' => (string) $validated['dni'],
            'Sexo__c' => $validated['gender'],
            'FECHA_NACIMIENTO__c' => Carbon::createFromDate($validated['birthDate'])->toDateString(),
            'tipo_vivienda__c' => $tipoViviendaId,
            'Street' => trim($calle[0] ?? ''),
            'NUMERO_DOMICILIO__c' => trim($calle[1] ?? ''),
            'PISO_DOMICILIO__c' => trim($calle[2] ?? ''),
            'DPTO_DOMICILIO__c' => trim($calle[3] ?? ''),
            'Domicilio_Localidad__c' => trim($domicilio[1] ?? ''),
            'Domicilio_Provincia__c' => trim($domicilio[2] ?? ''),
            'PostalCode' => trim($domicilio[3] ?? ''),
            'Medio_de_Pago__c' => $paymentMethodId,
            'Origen_de_Pago__c' => $paymentOriginId,
            'Pago__c' => $validated['paymentValue'] ? $this->_crypt->encrypt($validated['paymentValue']) : '-1',
        ];

        if (!$input['Sexo__c'] || !$input['FECHA_NACIMIENTO__c']) {
            $this->_throw('Los campos referidos a la información personal de la persona (género y/o fecha de nacimiento) son incorrectos.');
        }

        if (
            !$input['Street']
            || !$input['NUMERO_DOMICILIO__c']
            || !$input['Domicilio_Localidad__c']
            || !$input['Domicilio_Provincia__c']
            || !$input['PostalCode']
        ) {
            $this->_throw('Los campos referidos al domicilio son incorrectos.');
        }

        $product = $this->getProductosEnlatado($validated['plan']['planId']);
        $enlatado = collect($product['enlatados'])->filter(fn ($item) => $item['id'] === $validated['plan']['id'])->first();

        $input = array_merge($input, [
            'Cod_Ramo__c' => $product['ramoIdBHSeg'],
            'Cod_Producto__c' => $product['productoIdBHSeg'],
            'Cod_Plan__c' => '001',
            'Desc_Ramo__c' => $product['descripcionRamo'],
            'Desc_Producto__c' => $product['descripcionProducto'],
            'COMBINATORIA__c' => $enlatado['id'],
            'premio__c' => (string) $enlatado['premio'],
            'Sponsor__c' => $enlatado['productor'],
            'LeadSource' => $enlatado['productor'],
            'Company' => $enlatado['productor'],
            'PAGO_RESULTADO__c' => '',
            'Paso_de_Venta__c' => '5'
        ]);

        $res = $this->_tryOne(function () use ($input) {
            return $this->_send('post', '/services/data/v52.0/sobjects/Lead', [
                'json' => $input,
            ]);
        });

        if (empty($res['id'])) {
            $this->_throw('No se pudo crear el lead.');
        }

        return [
            'leadId' => $res['id'],
        ];
    }

    public function getLeadFile(string $leadId)
    {
        $res = $this->_tryOne(function () use ($leadId) {
            return $this->_send('get', '/services/apexrest/documentacion/poliza/frentepoliza/', [
                'query' => [
                    'pieza' => $leadId
                ],
            ]);
        });

        return $res;
    }
}
