<?php

namespace App\Packages\RESTful\Resolvers;

use App\Packages\RESTful\Resolvers\IRESTfulResolver;

class RESTfulSearchResolver implements IRESTfulResolver
{
    private $_search;

    public function __construct(Array $params) {
        if (!empty($params['search'])) {
            $this->_search = $params['search'];
        }
    }

    /* -------------------- */

    public function resolve($query) {
        return $query->when($this->_search, function ($query) {
            return $query->where(function ($query) {
                $fields = explode(',', $this->_search['by']);
                $value = $this->_search['query'];
                $strict = (boolean) ($this->_search['strict'] ?? 0);

                foreach ($fields as $field) {
                    $whereMode = 'orWhere';

                    if ($strict) {
                        $whereMode = 'where';
                    }

                    $query = $query->$whereMode($field, 'like', '%' . $value . '%');
                }

                return $query;
            });
        });
    }
}
