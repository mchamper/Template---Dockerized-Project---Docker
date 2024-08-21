<?php

namespace App\Core\Bases;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;

// abstract class BaseRequest extends FormRequest
abstract class BaseRequest
{
    abstract public static function rules(?array $params = []);

    /* -------------------- */

    protected static function _replaceRule(array &$fieldRules, $oldRule, $newRule)
    {
        $ruleIndex = is_numeric($oldRule)
            ? $oldRule
            : array_search($oldRule, $fieldRules);

        if ($ruleIndex !== false) {
            unset($fieldRules[$ruleIndex]);
            $fieldRules[$ruleIndex] = $newRule;

            ksort($fieldRules);
            $fieldRules = array_values($fieldRules);
        }
    }

    /* -------------------- */

    public static function rulesWithPrefix(string $prefix, ?array $params = [], )
    {
        return Arr::prependKeysWith(static::rules($params), "$prefix.");
    }

    public static function rulesFrom($input, ?array $params = [])
    {
        $rules = collect(static::rules($params))->filter(function ($value, $key) use ($input, $params) {
            $arrayKeyExists = false;

            foreach ($input as $key2 => $value2) {
                if ($arrayKeyExists = Str::startsWith($key, "$key2.")) {
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
