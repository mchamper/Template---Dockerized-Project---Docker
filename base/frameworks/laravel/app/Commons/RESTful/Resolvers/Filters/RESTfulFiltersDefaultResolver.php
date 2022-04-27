<?php

namespace App\Packages\RESTful\Resolvers\Filters;

use App\Packages\RESTful\Resolvers\Filters\RESTfulFiltersResolver;

class RESTfulFiltersDefaultResolver extends RESTfulFiltersResolver
{
    private $_filters;
    private $_filters_or;
    private $_orFilters;
    private $_orFilters_or;

    public function __construct(Array $params, $tableName = null) {
        parent::__construct($tableName);

        if (!empty($params['filters'])) {
            $this->_filters = $params['filters'];
        }

        if (!empty($params['filters:or'])) {
            $this->_filters_or = $params['filters:or'];
        }

        if (!empty($params['orFilters'])) {
            $this->_orFilters = $params['orFilters'];
        }

        if (!empty($params['orFilters:or'])) {
            $this->_orFilters_or = $params['orFilters:or'];
        }
    }

    /* -------------------- */

    public function resolve($query) {
        $query = $query->when($this->_filters, function ($query) {
            $query = $query->where(function ($query) {
                foreach ($this->_filters as $field => $value) {
                    $query = $this->_createFilter($query, $field, $value);
                }

                return $query;
            });
        });

        $query = $query->when($this->_filters_or, function ($query) {
            $query = $query->where(function ($query) {
                foreach ($this->_filters_or as $field => $value) {
                    $query = $this->_createFilter($query, $field, $value, true);
                }

                return $query;
            });
        });

        $query = $query->when($this->_orFilters, function ($query) {
            $query = $query->orWhere(function ($query) {
                foreach ($this->_orFilters as $field => $value) {
                    $query = $this->_createFilter($query, $field, $value);
                }

                return $query;
            });
        });

        $query = $query->when($this->_orFilters_or, function ($query) {
            $query = $query->orWhere(function ($query) {
                foreach ($this->_orFilters_or as $field => $value) {
                    $query = $this->_createFilter($query, $field, $value, true);
                }

                return $query;
            });
        });

        return $query;
    }
}
