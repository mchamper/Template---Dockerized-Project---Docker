<?php

namespace App\Core\RESTful;

use App\Core\RESTful\Resolvers\RESTfulFieldsResolver;
use App\Core\RESTful\Resolvers\RESTfulWithResolver;
use App\Core\RESTful\Resolvers\RESTfulWithCountResolver;
use App\Core\RESTful\Resolvers\Filters\RESTfulFiltersDefaultResolver;
use App\Core\RESTful\Resolvers\Filters\RESTfulFiltersAdvanceResolver;
use App\Core\RESTful\Resolvers\RESTfulScopesResolver;
use App\Core\RESTful\Resolvers\RESTfulSearchResolver;
use App\Core\RESTful\Resolvers\RESTfulSortResolver;
use App\Core\RESTful\Resolvers\RESTfulAppendsResolver;
use App\Core\RESTful\Resolvers\RESTfulGroupByResolver;

class RESTful
{
    private $_resource;

    private $_fieldsResolver;
    private $_withResolver;
    private $_withCountResolver;
    private $_filtersDefaultResolver;
    private $_filtersAdvanceResolver;
    private $_scopesResolver;
    private $_searchResolver;
    private $_sortResovler;
    private $_groupByResovler;
    private $_appendsResolver;

    private $_limit;
    private $_offset;

    public function __construct($resource, array $params, $tableName = null) {
        $this->_resource = $resource;

        if (!$tableName) {
            if (method_exists($this->_resource, 'getTable')) {
                $tableName = $this->_resource->getTable();
            }
        }

        $this->_fieldsResolver = new RESTfulFieldsResolver($params, $tableName);
        $this->_withResolver = new RESTfulWithResolver($params);
        $this->_withCountResolver = new RESTfulWithCountResolver($params);
        $this->_filtersDefaultResolver = new RESTfulFiltersDefaultResolver($params, $tableName);
        $this->_filtersAdvanceResolver = new RESTfulFiltersAdvanceResolver($params, $tableName);
        $this->_scopesResolver = new RESTfulScopesResolver($params, $tableName);
        $this->_searchResolver = new RESTfulSearchResolver($params);
        $this->_sortResovler = new RESTfulSortResolver($params);
        $this->_groupByResovler = new RESTfulGroupByResolver($params);
        $this->_appendsResolver = new RESTfulAppendsResolver($params);

        if (array_key_exists('limit', $params) && is_numeric($params['limit'])) {
            $this->_limit = (int) $params['limit'];
            $this->_limit <= 0 ? $this->_limit = 9999999 : null;
        }

        if (!empty($params['offset'])) {
            $this->_offset = (int) $params['offset'];
        }

        $this->_resource = $this->_fieldsResolver->resolve($this->_resource);
        $this->_resource = $this->_withResolver->resolve($this->_resource);
        $this->_resource = $this->_withResolver->resolveRelation($this->_resource);
        $this->_resource = $this->_withCountResolver->resolve($this->_resource);
        $this->_resource = $this->_withCountResolver->resolveRelation($this->_resource);
        $this->_resource = $this->_filtersDefaultResolver->resolve($this->_resource);
        $this->_resource = $this->_filtersAdvanceResolver->resolve($this->_resource);
        $this->_resource = $this->_scopesResolver->resolve($this->_resource);
        $this->_resource = $this->_searchResolver->resolve($this->_resource);
        $this->_resource = $this->_sortResovler->resolve($this->_resource);
        $this->_resource = $this->_groupByResovler->resolve($this->_resource);
    }

    /* -------------------- */

    public function getQuery(bool $mustClone = false)
    {
        // dd($this->_resource->toSql());

        if ($mustClone) {
            return clone $this->_resource;
        }

        return $this->_resource;
    }

    /* -------------------- */

    public function paginate(bool $mustClone = false)
    {
        return $this->_appendsResolver->resolve($this->getQuery($mustClone)->paginate($this->_limit));
    }

    public function get(bool $mustClone = false)
    {
        return $this->_appendsResolver->resolve($this->getQuery($mustClone)
            ->when($this->_limit, function ($query) {
                return $query->limit($this->_limit);
            })
            ->when($this->_offset, function ($query) {
                return $query->offset($this->_offset);
            })
            ->get());
    }

    public function count(bool $mustClone = false)
    {
        return $this->getQuery($mustClone)->count();
    }

    public function sum(string $field, bool $mustClone = false)
    {
        return $this->getQuery($mustClone)->sum($field);
    }

    public function find($primaryKeys, bool $mustClone = false)
    {
        return $this->_appendsResolver->resolve($this->getQuery($mustClone)->find($primaryKeys));
    }

    public function findOrFail($primaryKeys, bool $mustClone = false)
    {
        return $this->_appendsResolver->resolve($this->getQuery($mustClone)->findOrFail($primaryKeys));
    }

    public function first(bool $mustClone = false)
    {
        return $this->_appendsResolver->resolve($this->getQuery($mustClone)->first());
    }

    public function firstOrFail(bool $mustClone = false)
    {
        return $this->_appendsResolver->resolve($this->getQuery($mustClone)->firstOrFail());
    }

    public function exists(bool $mustClone = false)
    {
        return $this->getQuery($mustClone)->exists();
    }

    public function doesntExist(bool $mustClone = false)
    {
        return $this->getQuery($mustClone)->doesntExist();
    }
}
