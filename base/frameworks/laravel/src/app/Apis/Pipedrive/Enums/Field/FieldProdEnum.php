<?php

namespace App\Apis\Pipedrive\Enums\Field;

enum FieldProdEnum: string
{
    case DealInsurancePlan = '028bae9a6aa7744eabccd9d075d1fa452e3c2d86';
    case DealAddress = '494f310d46fc11f20d01d64b79ad52226bc25924';
    case DealHousingType = '09ec423c7f6759b26994bfac13810597d53cba92';
    case DealPaymentMethod = 'ec150758578690c05c898ce7ede842dab59c64d6';
    case DealPaymentValue = '8ea899126b90bff917d60ed7d3d9ad3887548860';
    /* -------------------- */
    case PersonFullName = 'name';
    case PersonFirstName = '20792bdcaf80417cd4698b828755597bbf18ff8e';
    case PersonLastName = 'd44fc56031d43eaf8127183c02304d5b2d35025c';
    case PersonEmail = 'email.0.value';
    case PersonPhone = 'phone.0.value';
    case PersonDni = '5156710975b7c2ae9c9b2f1c36a4a56fc281eb24';
    case PersonBirthday = 'a10333b641d3817120925ca7be18ef90d230b920';
    case PersonGender = '0f339d5f9ecfc9ed8d170db73b0f2deea271bb59';

    /* -------------------- */

    public function data(): array
    {
        return match ($this) {
            self::DealInsurancePlan => [
                'combo' => collect([
                    ['id' => 392, 'label' => 'BASICO'],
                    ['id' => 393, 'label' => 'PROTEGIDO'],
                    ['id' => 394, 'label' => 'PROTEGIDO_PLUS'],
                    ['id' => 413, 'label' => 'PROTEGIDO_PLUS_3'],
                    ['id' => 414, 'label' => 'PROTEGIDO_PLUS_4'],
                    ['id' => 415, 'label' => 'PROTEGIDO_PLUS_5'],
                    ['id' => 416, 'label' => 'PROTEGIDO_PLUS_6'],
                    ['id' => 417, 'label' => 'PROTEGIDO_PLUS_7'],
                    ['id' => 418, 'label' => 'PROTEGIDO_PLUS_8'],
                ]),
            ],
            self::DealHousingType => [
                'combo' => collect([
                    ['id' => 374, 'label' => 'CASA'],
                    ['id' => 375, 'label' => 'DEPARTAMENTO'],
                ]),
            ],
            self::DealPaymentMethod => [
                'combo' => collect([
                    ['id' => 281, 'label' => 'TRANSFERENCIA'],
                    ['id' => 282, 'label' => 'VISA_CREDITO'],
                    ['id' => 283, 'label' => 'VISA_DEBITO'],
                    ['id' => 284, 'label' => 'MASTERCARD'],
                    ['id' => 285, 'label' => 'BOTON_PRISMA'],
                    ['id' => 286, 'label' => 'BOTON_MEPA'],
                    ['id' => 287, 'label' => 'CHEQUE'],
                    ['id' => 346, 'label' => 'PAGO_MERIDIANO'],
                    ['id' => 357, 'label' => 'CBU'],
                ]),
            ],
            self::PersonGender => [
                'combo' => collect([
                    ['id' => 372, 'label' => 'FEMENINO'],
                    ['id' => 373, 'label' => 'MASCULINO'],
                ])
            ],
            default => [],
        };
    }
}
