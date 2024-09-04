<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Core\Bases\BaseModelTrait;
use App\Core\Models\Traits\HasMedias;
use App\Models\Traits\Auth\AuthTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;

class User extends Authenticatable implements HasMedia
{
    use BaseModelTrait;
    use HasFactory;
    use Notifiable;
    use HasApiTokens;
    use SoftDeletes;
    use AuthTrait;
    use HasMedias;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'token_for_email_verification',
        'token_for_password_reset',
    ];

    protected $medias = [
        'picture' => [
            'visibility' => 'public',
            'type' => 'single',
        ],
        'photos' => [
            'visibility' => 'private',
            'type' => 'multiple',
        ],
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
            'password' => 'hashed',
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
        return $query->where('id', '!=', auth('api_user')->id());
    }
}
