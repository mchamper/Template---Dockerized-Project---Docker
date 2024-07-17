<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LocationLevelA extends Model
{
    use HasFactory;

    protected $table = 'location_level_a';
    public $timestamps = false;

    public function parent()
    {
        return $this->belongsTo(LocationCountry::class);
    }

    /**
     * Accesors & Mutators.
     */
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => "{$this->parent->full_name}, {$this->name}",
        );
    }
}
