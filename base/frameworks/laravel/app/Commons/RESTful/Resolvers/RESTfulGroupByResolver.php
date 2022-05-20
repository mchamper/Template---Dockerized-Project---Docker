<?php

namespace App\Commons\RESTful\Resolvers;

use App\Commons\RESTful\Resolvers\IRESTfulResolver;

class RESTfulGroupByResolver implements IRESTfulResolver
{
    private $_groupBy;

    public function __construct(Array $params) {
        if (!empty($params['group_by'])) {
            $this->_groupBy = explode(',', $params['group_by']);
        }
    }

    /* -------------------- */

    public function resolve($query) {
        return $query->when($this->_groupBy, function ($query) {
            return $query->groupBy($this->_groupBy);
        });
    }
}
