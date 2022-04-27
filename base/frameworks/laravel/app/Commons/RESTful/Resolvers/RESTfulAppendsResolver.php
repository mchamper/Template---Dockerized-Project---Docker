<?php

namespace App\Packages\RESTful\Resolvers;

use App\Packages\RESTful\Resolvers\IRESTfulResolver;

class RESTfulAppendsResolver implements IRESTfulResolver
{
    private $_appends;

    public function __construct(Array $params, $tableName = null) {
        if (!empty($params['appends'])) {
            $this->_appends = explode(',', $params['appends']);
        }
    }

    /* -------------------- */

    public function resolve($res) {
        if ($this->_appends) {
            if (method_exists($res, 'setAppends')) {
                return $res->setAppends($this->_appends);
            }

            if ($res) {
                $res->data = $res->each(function ($item, $key) {
                    return $item->setAppends($this->_appends);
                });
            }
        }

        return $res;
    }
}
