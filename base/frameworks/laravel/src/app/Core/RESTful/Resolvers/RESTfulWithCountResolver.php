<?php

namespace App\Core\RESTful\Resolvers;

use App\Core\RESTful\Resolvers\IRESTfulResolver;
use App\Core\RESTful\RESTful;

class RESTfulWithCountResolver implements IRESTfulResolver
{
    private $_with;
    private $_withRelation;

    public function __construct(Array $params) {
        if (!empty($params['with_count'])) {
            if (!is_array($params['with_count'])) {
                $this->_with = explode(',', $params['with_count']);
            } else {
                $this->_withRelation = $params['with_count'];
            }
        }
    }

    /* -------------------- */

    public function resolve($query) {
        return $query->when($this->_with, function ($query) {
            return $query->withCount($this->_with);
        });
    }

    public function resolveRelation($query) {
        return $query->when($this->_withRelation, function ($query) {
            foreach ($this->_withRelation as $relation => $params) {
                $query = $query->withCount([
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
