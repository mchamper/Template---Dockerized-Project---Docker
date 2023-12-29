<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Locality extends Model
{
    use HasFactory;

    public $timestamps = false;

    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    /**
     * Accesors & Mutators.
     */
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => "{$this->province->full_name}, {$this->name}",
        );
    }
}
