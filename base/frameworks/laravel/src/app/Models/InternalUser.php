<?php

namespace App\Models;

use App\Core\Bases\BaseModelTrait;
use App\Core\Models\Traits\HasRolesAndPermissions;
use App\Models\Traits\Auth\AuthStatusTrait;
use App\Models\Traits\Auth\AuthTokenTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class InternalUser extends Authenticatable
{
    use BaseModelTrait;
    use HasFactory;
    use Notifiable;
    use HasApiTokens;
    use SoftDeletes;
    use AuthStatusTrait;
    use AuthTokenTrait;
    use HasRolesAndPermissions;

    protected $appends = [
        'full_name',
    ];

    /**
     * Accesors & Mutators.
     */
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $attributes['name'],
        );
    }

    /**
     * Scopes.
     */
    public function scopeNoAuth($query) {
        return $query->where('id', '!=', auth('api_internal-user')->id());
    }
}
