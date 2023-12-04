<?php

namespace App\Core\RESTful\Resolvers;

use Illuminate\Support\Str;
use App\Core\RESTful\Resolvers\IRESTfulResolver;

class RESTfulSortResolver implements IRESTfulResolver
{
    private $_sort;

    public function __construct(Array $params) {
        if (!empty($params['sort'])) {
            $this->_sort = explode(',', $params['sort']);
        }
    }

    /* -------------------- */

    public function resolve($query) {
        return $query->when($this->_sort, function ($query) {
            foreach ($this->_sort as $value) {
                $sortDirection = 'asc';

                if (Str::startsWith($value, '-')) {
                    $sortDirection = 'desc';
                    $value = str_replace('-', '', $value);
                }

                if ($value === 'random') {
                    $query = $query->inRandomOrder();
                } else {
                    $query = $query->orderBy($value, $sortDirection);
                }
            }

            return $query;
        });
    }
}
