<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

abstract class BaseRequest extends FormRequest
{
    public function rulesFrom(?array $params = [])
    {
        $rules = collect($this->rules($params))->filter(function ($value, $key) use ($params) {
            $arrayKeyExists = false;

            foreach ($params['input'] as $key2 => $value2) {
                if ($arrayKeyExists = Str::startsWith($key, $key2 . '.')) {
                    break;
                }
            }

            return $arrayKeyExists || array_key_exists($key, $params['input']);
        })->toArray();

        if (empty($rules)) {
            $rules = $this->rules($params);
        }

        return $rules;
    }
}
