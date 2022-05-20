<?php

namespace App\Commons\RESTful\Resolvers;

use App\Commons\RESTful\Resolvers\IRESTfulResolver;
use App\Commons\RESTful\RESTful;

class RESTfulWithResolver implements IRESTfulResolver
{
    private $_with;
    private $_withRelation;

    public function __construct(Array $params) {
        if (!empty($params['with'])) {
            if (!is_array($params['with'])) {
                $this->_with = explode(',', $params['with']);
            } else {
                $this->_withRelation = $params['with'];
            }
        }
    }

    /* -------------------- */

    public function resolve($query) {
        return $query->when($this->_with, function ($query) {
            return $query->with($this->_with);
        });
    }

    public function resolveRelation($query) {
        return $query->when($this->_withRelation, function ($query) {
            foreach ($this->_withRelation as $relation => $params) {
                $query = $query->with([
                    $relation => function ($query) use ($params) {
                        if (method_exists($query, 'getRelated')) {
                            $tableName = $query->getRelated()->getTable();
                        }

                        return (new RESTful($query, (array) $params, $tableName ?? null))->getQuery();
                    }
                ]);
            }

            return $query;
        });
    }
}
