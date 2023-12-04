<?php

namespace App\Core\Bases;

use App\Core\Models\Traits\HasEnums;
use App\Core\Models\Traits\HasMedias;

trait BaseModelTrait
{
    use HasEnums;
    use HasMedias;

    protected $appendAttributes = [];

    public function appendAttribute(string $key)
    {
        $this->attributes[$key] = $this->appendAttributes[$key]();
    }

    public function toArray()
    {
        $attributes = [];

        foreach ($this->appendAttributes as $key => $valueFn) {
            $attributes[$key] = $valueFn();
        }

        return array_merge(parent::toArray(), $attributes);
    }
}
