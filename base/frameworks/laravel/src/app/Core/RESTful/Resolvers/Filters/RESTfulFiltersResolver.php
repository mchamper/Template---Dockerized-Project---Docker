<?php

namespace App\Core\RESTful\Resolvers\Filters;

use App\Core\RESTful\Resolvers\IRESTfulResolver;
use App\Core\RESTful\Resolvers\Filters\RESTfulFiltersDefaultResolver;
use App\Core\RESTful\Resolvers\Filters\RESTfulFiltersAdvanceResolver;
use App\Core\RESTful\Mappers\RESTfulOperationsMapper;
use Carbon\Carbon;
use Illuminate\Support\Str;

abstract class RESTfulFiltersResolver implements IRESTfulResolver
{
    private $_tableName;

    public function __construct($tableName) {
        $this->_tableName = $tableName;
    }

    /* -------------------- */

    protected function _createFilter($query, $field, $value, $isOr = false) {
        $fieldExploded = explode('|', $field);

        $field = $fieldExploded[0];
        $operation = $fieldExploded[1] ?? 'eq';

        if ($this->_tableName) {
            if (strpos($field, '.') === false) {
                $field = $this->_tableName . '.' . $field;
            }
        }

        switch ($operation) {
            case 'eq':
            case '!eq':
            case '<':
            case '<eq':
            case '>':
            case '>eq':
            case 'like':
            case 'ilike':
            case '!like':
            case '!ilike': {
                $method = $isOr ? 'orWhere' : 'where';
                return $query->$method($field, RESTfulOperationsMapper::get($operation), $value);
            }

            case '-like':
            case '-ilike':
            case '-!like':
            case '-!ilike': {
                $operation = Str::replace('-', '', $operation);
                $method = $isOr ? 'orWhere' : 'where';

                return $query->$method($field, RESTfulOperationsMapper::get($operation), '%' . $value);
            }

            case 'like-':
            case 'ilike-':
            case '!like-':
            case '!ilike-': {
                $operation = Str::replace('-', '', $operation);
                $method = $isOr ? 'orWhere' : 'where';

                return $query->$method($field, RESTfulOperationsMapper::get($operation), $value . '%');
            }

            case '-like-':
            case '-ilike-':
            case '-!like-':
            case '-!ilike-': {
                $operation = Str::replace('-', '', $operation);
                $method = $isOr ? 'orWhere' : 'where';

                return $query->$method($field, RESTfulOperationsMapper::get($operation), '%' . $value . '%');
            }

            case 'null': {
                $method = $isOr ? 'orWhereNull' : 'whereNull';
                return $query->$method($field);
            }

            case '!null': {
                $method = $isOr ? 'orWhereNotNull' : 'whereNotNull';
                return $query->$method($field);
            }

            case 'in': {
                $method = $isOr ? 'orWhereIn' : 'whereIn';
                return $query->$method($field, explode(',', $value));
            }

            case '!in': {
                $method = $isOr ? 'orWhereNotIn' : 'whereNotIn';
                return $query->$method($field, explode(',', $value));
            }

            case 'between': {
                $method = $isOr ? 'orWhereBetween' : 'whereBetween';
                return $query->$method($field, explode(',', $value));
            }

            case '!between': {
                $method = $isOr ? 'orWhereNotBetween' : 'whereNotBetween';
                return $query->$method($field, explode(',', $value));
            }

            case 'betweenDates': {
                $method = $isOr ? 'orWhereBetween' : 'whereBetween';

                $dates = explode(',', $value);
                $firstDate = Carbon::createFromFormat('Y-m-d', $dates[0])->startOfDay()->timezone($dates[2] ?? 0);
                $lastDate = Carbon::createFromFormat('Y-m-d', $dates[1])->endOfDay()->timezone($dates[2] ?? 0);

                return $query->$method($field, [$firstDate, $lastDate]);
            }

            case '!betweenDates': {
                $method = $isOr ? 'orWhereNotBetween' : 'whereNotBetween';

                $dates = explode(',', $value);
                $firstDate = Carbon::createFromFormat('Y-m-d', $dates[0])->startOfDay()->timezone($dates[2] ?? 0);
                $lastDate = Carbon::createFromFormat('Y-m-d', $dates[1])->endOfDay()->timezone($dates[2] ?? 0);

                return $query->$method($field, [$firstDate, $lastDate]);
            }

            case 'date': {
                $method = $isOr ? 'orWhereDate' : 'whereDate';
                return $query->$method($field, $value);
            }

            case 'month': {
                $method = $isOr ? 'orWhereMonth' : 'whereMonth';
                return $query->$method($field, $value);
            }

            case 'day': {
                $method = $isOr ? 'orWhereDay' : 'whereDay';
                return $query->$method($field, $value);
            }

            case 'year': {
                $method = $isOr ? 'orWhereYear' : 'whereYear';
                return $query->$method($field, $value);
            }

            case 'time': {
                $method = $isOr ? 'orWhereTime' : 'whereTime';
                return $query->$method($field, $value);
            }

            case 'column': {
                $method = $isOr ? 'orWhereColumn' : 'whereColumn';

                $values = explode(',', $value);
                $columnOperation = $values[0];
                $columnValue = $values[1];

                return $query->$method($field, RESTfulOperationsMapper::get($columnOperation), $columnValue);
            }

            case 'has': {
                $method = $isOr ? 'orWhereHas' : 'whereHas';

                return $query->$method($field, function ($query) use ($value) {
                    if (is_array($value)) {
                        if (method_exists($query, 'getRelated')) {
                            $tableName = $query->getRelated()->getTable();
                        }

                        $filtersDefaultResolver = new RESTfulFiltersDefaultResolver($value, $tableName ?? null);
                        $filtersAdvanceResolver = new RESTfulFiltersAdvanceResolver($value, $tableName ?? null);

                        $query = $filtersDefaultResolver->resolve($query);
                        $query = $filtersAdvanceResolver->resolve($query);
                    }

                    return $query;
                });
            }

            case '!has': {
                $method = $isOr ? 'orWhereDoesntHave' : 'orWhereDoesntHave';

                return $query->$method($field, function ($query) use ($value) {
                    if (is_array($value)) {
                        if (method_exists($query, 'getRelated')) {
                            $tableName = $query->getRelated()->getTable();
                        }

                        $filtersDefaultResolver = new RESTfulFiltersDefaultResolver($value, $tableName ?? null);
                        $filtersAdvanceResolver = new RESTfulFiltersAdvanceResolver($value, $tableName ?? null);

                        $query = $filtersDefaultResolver->resolve($query);
                        $query = $filtersAdvanceResolver->resolve($query);
                    }

                    return $query;
                });
            }

            default: return $query;
        }
    }
}
