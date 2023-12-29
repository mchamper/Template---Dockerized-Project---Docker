<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    use HasFactory;

    public $timestamps = false;

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * Accesors & Mutators.
     */
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => "{$this->country->full_name}, {$this->name}",
        );
    }
}
