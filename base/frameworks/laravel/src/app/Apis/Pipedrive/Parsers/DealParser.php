<?php

namespace App\Apis\Pipedrive\Parsers;

use App\Apis\Pipedrive\Enums\Field\FieldEnum;
use App\Apis\Pipedrive\PipedriveDealApi;
use App\Apis\Pipedrive\PipedrivePersonApi;

class DealParser
{
    public static function getPolicyPipedriveData(int $dealId)
    {
        $pipedriveDealApi = new PipedriveDealApi();
        $pipedrivePersonApi = new PipedrivePersonApi();

        $deal = $pipedriveDealApi->getDeal($dealId);
        $person = $pipedrivePersonApi->getPerson($deal->person_id->value);

        return [
            'plan' => FieldEnum::DealInsurancePlan->get($deal),
            'firstName' => FieldEnum::PersonFirstName->get($person),
            'lastName' => FieldEnum::PersonLastName->get($person),
            'fullName' => FieldEnum::PersonFullName->get($person),
            'phone' => FieldEnum::PersonPhone->get($person),
            'email' => FieldEnum::PersonEmail->get($person),
            'dni' => FieldEnum::PersonDni->get($person),
            'gender' => FieldEnum::PersonGender->get($person),
            'birthDate' => FieldEnum::PersonBirthday->get($person),
            'address' => FieldEnum::DealAddress->get($deal),
            'housingType' => FieldEnum::DealHousingType->get($deal),
            'paymentMethod' => FieldEnum::DealPaymentMethod->get($deal),
            'paymentNumber' => FieldEnum::DealPaymentValue->get($deal),
            'updatedAt' => now(),
        ];
    }
}
