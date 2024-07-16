<?php

namespace App\Models;

use App\Core\Bases\BaseModelTrait;
use App\Core\Models\Traits\HasMedias;
use App\Core\Models\Traits\HasRolesAndPermissions;
use App\Models\Traits\Auth\AuthTokenTrait;
use App\Models\Traits\Auth\AuthVerificationTrait;
use App\Models\Traits\Auth\AuthStatusTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class ExternalUser extends Authenticatable
{
    use BaseModelTrait;
    use HasFactory;
    use Notifiable;
    use HasApiTokens;
    use AuthStatusTrait;
    use AuthVerificationTrait;
    use AuthTokenTrait;
    use HasRolesAndPermissions;
    use HasMedias;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'token_for_email_verification',
    ];

    protected $medias = [
        'picture' => 'single',
        'photos' => 'multiple',
    ];

    protected $appends = [
        'full_name',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
        ];
    }

    /**
     * Accesors & Mutators.
     */
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => trim($attributes['first_name'] . ' ' . $attributes['last_name']),
        );
    }

    /**
     * Scopes.
     */
    public function scopeNoAuth($query) {
        return $query->where('id', '!=', auth('api_external-user')->id());
    }
}
