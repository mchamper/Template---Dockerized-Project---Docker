<?php

namespace App\Core\RESTful\Resolvers;

use App\Core\RESTful\Resolvers\IRESTfulResolver;

class RESTfulFieldsResolver implements IRESTfulResolver
{
    private $_fields;
    private $_tableName;

    public function __construct(Array $params, $tableName = null) {
        if (!empty($params['fields'])) {
            $this->_fields = explode(',', $params['fields']);

            if (!in_array('id', $this->_fields)) {
                $this->_fields = array_merge(['id'], $this->_fields);
            }

            $this->_tableName = $tableName;

            if ($this->_tableName) {
                foreach ($this->_fields as $key => $value) {
                    if (strpos($value, '.') === false) {
                        $this->_fields[$key] = $this->_tableName . '.' . $value;
                    }
                }
            }
        }
    }

    /* -------------------- */

    public function resolve($query) {
        return $query->when($this->_fields, function ($query) {
            return $query->addSelect($this->_fields);
        });
    }
}
