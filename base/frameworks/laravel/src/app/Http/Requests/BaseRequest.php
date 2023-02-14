<?php

namespace Teatrix\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

abstract class BaseRequest extends FormRequest
{
    public function rulesFrom($input, ?array $params = [])
    {
        $rules = collect($this->rules($params))->filter(function ($value, $key) use ($input, $params) {
            $arrayKeyExists = false;

            foreach ($input as $key2 => $value2) {
                if ($arrayKeyExists = Str::startsWith($key, $key2 . '.')) {
                    break;
                }
            }

            return $arrayKeyExists || array_key_exists($key, $input);
        })->toArray();

        if (empty($rules)) {
            $rules = $this->rules($params);
        }

        return $rules;
    }
}
