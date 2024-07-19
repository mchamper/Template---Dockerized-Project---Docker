<?php

namespace App\Core\Models\Traits;

use App\Models\SystemUser;

trait HasCreatedBy
{

    protected $_createdByClass = SystemUser::class;

    public static function bootHasCreatedBy()
    {
        static::creating(function ($model) {
            if (auth()->check()) {
                $model->created_by_id = auth()->id();
                $model->updated_by_id = auth()->id();
            }
        });

        static::updating(function ($model) {
            if (auth()->check()) {
                $model->updated_by_id = auth()->id();
            }
        });
    }

    /* -------------------- */

    public function created_by()
    {
        return $this->belongsTo($this->_createdByClass);
    }

    public function updated_by()
    {
        return $this->belongsTo($this->_createdByClass);
    }
}
