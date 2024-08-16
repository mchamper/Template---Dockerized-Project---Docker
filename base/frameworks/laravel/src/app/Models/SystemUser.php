<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Core\Bases\BaseModelTrait;
use App\Core\Models\Traits\HasMedias;
use App\Core\Models\Traits\HasRolesAndPermissions;
use App\Models\Traits\Auth\AuthTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\Permission\Models\Permission;

class SystemUser extends Authenticatable implements HasMedia
{
    use BaseModelTrait;
    use HasFactory;
    use Notifiable;
    use HasApiTokens;
    use SoftDeletes;
    use AuthTrait;
    use HasRolesAndPermissions;
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
     * Relations.
     */
    public function status(): BelongsTo
    {
        return $this->belongsTo(AuthStatus::class);
    }

    public function social_driver(): BelongsTo
    {
        return $this->belongsTo(AuthSocialDriver::class);
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
    public function scopeNoRoot($query) {
        return $query->where('email', '!=', 'root');
    }

    public function scopeNoAuth($query) {
        return $query->where('id', '!=', auth('api_system-user')->id());
    }
}
