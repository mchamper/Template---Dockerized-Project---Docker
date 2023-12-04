<?php

namespace App\Core\Models\Traits;

trait HasEnums
{
    public function initializeHasEnums()
    {
        static::_hasEnumsAddCasts($this);
        static::_hasEnumsAppendAttributes($this);
    }

    /* -------------------- */

    private static function _hasEnumsAddCasts($model)
    {
        if ($model->enums) {
            foreach ($model->enums as $key => $enum) {
                $model->casts[$key] = $enum;
            }
        }
    }

    private static function _hasEnumsAppendAttributes($model)
    {
        if ($model->enums) {
            foreach ($model->enums as $key => $enum) {
                $model->appendAttributes["{$key}_enum"] = fn () => $model->$key ? $model->$key->data() : null;
            }
        }
    }
}
