<?php

namespace App\Core\Bases;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

// abstract class BaseRequest extends FormRequest
abstract class BaseRequest
{
    abstract public static function rules(?array $params = []);

    public static function rulesFrom($input, ?array $params = [])
    {
        $rules = collect(static::rules($params))->filter(function ($value, $key) use ($input, $params) {
            $arrayKeyExists = false;

            foreach ($input as $key2 => $value2) {
                if ($arrayKeyExists = Str::startsWith($key, $key2 . '.')) {
                    break;
                }
            }

            return $arrayKeyExists || array_key_exists($key, $input);
        })->toArray();

        if (empty($rules)) {
            $rules = static::rules($params);
        }

        return $rules;
    }

    public static function validate($input, ?array $params = [])
    {
        return Validator::make($input, static::rules($params))->validate();
    }
}
