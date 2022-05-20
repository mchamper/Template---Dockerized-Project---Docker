<?php

namespace App\Commons\RESTful\Resolvers;

use App\Commons\RESTful\Resolvers\IRESTfulResolver;
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
                if (Str::contains($append, '.')) {
                    $appends = explode('.', $append, 2);
                    $resource = $res[$appends[0]];

                    $this->_setAppends($resource, [$appends[1]]);
                } else {
                    $this->_setAppends($res, $append);
                }
            }
        }

        return $res;
    }

    private function _setAppends($res, $appends)
    {
        if (method_exists($res, 'append')) {
            return $res->append($appends);
        }

        if ($res) {
            $res->data = $res->each(function ($item, $key) use ($appends) {
                return $item->append($appends);
            });
        }
    }
}
