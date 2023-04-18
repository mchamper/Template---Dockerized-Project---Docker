<?php

namespace App\Models;

use App\Enums\AppClientStatusEnum;
use App\Models\Traits\AppClient\AppClientTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class AppClient extends Authenticatable
{
    use HasFactory,
        HasApiTokens,
        SoftDeletes,
        AppClientTrait;

    protected $hidden = [
        'secret',
        'scopes',
        'hosts',
    ];

    protected $casts = [
        'scopes' => 'json',
        'hosts' => 'json',
        'status' => AppClientStatusEnum::class,
    ];

    protected $appends = [
        'status_enum',
    ];

    /**
     * Accesors & Mutators.
     */
    protected  function statusEnum(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status->value(),
        );
    }
}
