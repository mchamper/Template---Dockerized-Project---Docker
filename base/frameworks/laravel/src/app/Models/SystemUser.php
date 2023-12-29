<?php

namespace App\Models;

use App\Core\Bases\BaseModelTrait;
use App\Core\Models\Traits\HasMedias;
use App\Core\Models\Traits\HasRolesAndPermissions;
use App\Enums\SocialDriverEnum;
use App\Enums\SystemUserStatusEnum;
use App\Facades\Auth;
use App\Models\Traits\Auth\AuthTrait;
use App\Models\Traits\SystemUser\SystemUserTrait;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;

class SystemUser extends Authenticatable implements MustVerifyEmail, HasMedia
{
    use HasApiTokens;
    use HasFactory;
    use HasRolesAndPermissions;
    use HasMedias;
    use Notifiable;
    use SoftDeletes;
    use BaseModelTrait;
    use SystemUserTrait;
    use AuthTrait;

    protected $hidden = [
        'password',
        'token_for_email_verification',
        'token_for_password_reset',
    ];

    protected $dates = [
        'email_verified_at'
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    protected $enums = [
        'social_driver' => SocialDriverEnum::class,
        'status' => SystemUserStatusEnum::class,
    ];

    protected $medias = [
        'picture' => 'single',
        'photos' => 'multi',
    ];

    protected $appends = [
        'full_name',
    ];

    protected function getDefaultGuardName(): string { return Auth::getSystemUserGuardName(); }

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
        return $query->where('id', '!=', Auth::systemUser()->id);
    }
}
