<?php

namespace App\Apis\Pipedrive\Enums\Field;

enum FieldEnum
{
    case DealInsurancePlan;
    case DealAddress;
    case DealHousingType;
    case DealPaymentMethod;
    case DealPaymentValue;
    /* -------------------- */
    case PersonFullName;
    case PersonFirstName;
    case PersonLastName;
    case PersonEmail;
    case PersonPhone;
    case PersonDni;
    case PersonBirthday;
    case PersonGender;

    private function _enum()
    {
        $enum = !app()->environment('production')
            ? FieldProdEnum::class
            : FieldDevEnum::class;

        return collect($enum::cases())->where('name', $this->name)->firstOrFail();
    }

    /* -------------------- */

    public function get($object, $field = 'label')
    {
        $enum = $this->_enum();
        $enumValue = $enum->value;
        $enumData = $enum->data();

        if (!empty($enumData['combo'])) {
            return $enumData['combo']->where('id', ($object->$enumValue ?? null))->first()[$field] ?? null;
        }

        return data_get($object, $enumValue);
    }
}
