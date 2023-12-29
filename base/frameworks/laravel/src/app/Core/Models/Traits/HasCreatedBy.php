<?php

namespace App\Core\Models\Traits;

use App\Facades\Auth;
use App\Models\SystemUser;

trait HasCreatedBy
{

    public static function bootHasCreatedBy()
    {
        static::creating(function ($model) {
            if (Auth::systemUser()) {
                $model->created_by_id = Auth::systemUser()->id;
                $model->updated_by_id = Auth::systemUser()->id;
            }
        });

        static::updating(function ($model) {
            if (Auth::systemUser()) {
                $model->updated_by_id = Auth::systemUser()->id;
            }
        });
    }

    /* -------------------- */

    public function created_by()
    {
        return $this->belongsTo(SystemUser::class);
    }

    public function updated_by()
    {
        return $this->belongsTo(SystemUser::class);
    }
}
