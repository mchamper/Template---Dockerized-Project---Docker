<?php

namespace App\Apis\HipotecarioSeguros\Requests;

use App\Apis\HipotecarioSeguros\Enums\GenderEnum;
use App\Apis\HipotecarioSeguros\Enums\HousingTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class GenerateLeadRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public static function rules(): array
    {
        return [
            'plan' => ['bail', 'required'],
            'plan.id' => ['bail', 'required'],
            'plan.planId' => ['bail', 'required'],
            'tipoVivienda' => ['bail', 'required', new Enum(HousingTypeEnum::class)],
            'domicilio' => ['bail', 'required'],
            'firstName' => ['bail', 'required'],
            'lastName' => ['bail', 'required'],
            'email' => ['bail', 'required', 'email'],
            'phone' => ['bail', 'required'],
            'dni' => ['bail', 'required', 'numeric'],
            'gender' => ['bail', 'required', new Enum(GenderEnum::class)],
            'birthDate' => ['bail', 'required', 'date'],
            'paymentMethod' => ['bail', 'nullable', 'in:CBU,TC'],
            'paymentOrigin' => ['bail', 'nullable', 'in:CBU,VISA,MASTERCARD'],
            'paymentValue' => ['bail', 'nullable'],
        ];
    }
}
