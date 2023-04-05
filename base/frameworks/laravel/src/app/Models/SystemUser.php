<?php

namespace App\Models;

use App\Enums\SystemUserStatusEnum;
use App\Models\Traits\Auth\AuthTrait;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Permission\Traits\HasRoles;

class SystemUser extends Authenticatable implements MustVerifyEmail, HasMedia
{
    use HasApiTokens,
        HasRoles,
        HasFactory,
        Notifiable,
        SoftDeletes,
        InteractsWithMedia,
        AuthTrait;

    protected $hidden = [
        'media',
        'password',
        'token_for_email_verification',
        'token_for_password_reset',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'status' => SystemUserStatusEnum::class,
    ];

    protected $appends = [
        'full_name',
        'picture',
    ];

    /**
     * Media collections.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('picture');
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

    public function picture(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getFirstMediaUrl('picture'),
        );
    }
}
