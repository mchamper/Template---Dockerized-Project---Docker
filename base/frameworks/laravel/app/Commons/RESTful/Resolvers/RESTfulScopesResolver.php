<?php

namespace App\Commons\RESTful\Resolvers;

use App\Commons\RESTful\Resolvers\IRESTfulResolver;

class RESTfulScopesResolver implements IRESTfulResolver
{
    private $_scopes;
    private $_tableName;

    public function __construct(Array $params, $tableName = null) {
        if (!empty($params['scopes'])) {
            $this->_scopes = $params['scopes'];
        }
    }

    /* -------------------- */

    public function resolve($query) {
        return $query->when($this->_scopes, function ($query) {
            foreach ($this->_scopes as $scopeKey => $scope) {
                $value = $scope;

                if (is_string($value) && strpos($value, ',') !== false) {
                    $value = explode(',', $scope);
                }

                $query = $query->$scopeKey($value);
            }

            return $query;
        });
    }
}
