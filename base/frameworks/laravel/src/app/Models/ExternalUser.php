<?php

namespace App\Models;

use App\Models\Traits\Auth\AuthVerificationTrait;
use App\Models\Traits\Auth\AuthStatusTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class ExternalUser extends Authenticatable
{
    use HasFactory;
    use Notifiable;
    use HasApiTokens;
    use AuthStatusTrait;
    use AuthVerificationTrait;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'token_for_email_verification',
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
}
