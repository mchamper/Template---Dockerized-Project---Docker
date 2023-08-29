<?php

namespace App\Commons\RESTful\Resolvers;

use App\Commons\RESTful\Resolvers\IRESTfulResolver;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class RESTfulAppendsResolver implements IRESTfulResolver
{
    private $_appends;

    public function __construct(Array $params, $tableName = null)
    {
        if (!empty($params['appends'])) {
            $this->_appends = explode(',', $params['appends']);
        }
    }

    /* -------------------- */

    public function resolve($res)
    {
        if ($this->_appends) {
            foreach ($this->_appends as $append) {
                if (Str::contains($append, ':')) {
                    $appends = explode(':', $append, 2);
                    $properties = explode('.', $appends[0]);

                    $this->_setAppends($res, [$appends[1]], $properties);
                } else {
                    $this->_setAppends($res, $append);
                }
            }
        }

        return $res;
    }

    private function _setAppends($res, $appends, $properties = [])
    {
        if (method_exists($res, 'append')) {
            if (!empty($properties)) {
                $property = $properties[0];
                return $this->_setAppends($res->$property, $appends, array_values(Arr::except($properties, 0)));
            }

            return $res->append($appends);
        }

        if ($res) {
            $res->data = $res->each(function ($item, $key) use ($appends, $properties) {
                if (!empty($properties)) {
                    $property = $properties[0];
                    return $this->_setAppends($item->$property, $appends, array_values(Arr::except($properties, 0)));
                }

                return $item->append($appends);
            });
        }
    }
}
