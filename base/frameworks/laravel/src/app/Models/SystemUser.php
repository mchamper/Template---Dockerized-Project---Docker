<?php

namespace App\Models;

use App\Models\Traits\SystemUser\SystemUserTrait;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
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
        SystemUserTrait;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'media',
        'password',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
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

    protected function password(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => !empty($value) ? bcrypt($value) : null,
        );
    }

    protected function tokenForEmailVerification(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => !empty($value) ? bcrypt($value) : null,
        );
    }

    protected function tokenForPasswordReset(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => !empty($value) ? bcrypt($value) : null,
        );
    }

    public function picture(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getFirstMediaUrl('picture'),
        );
    }
}