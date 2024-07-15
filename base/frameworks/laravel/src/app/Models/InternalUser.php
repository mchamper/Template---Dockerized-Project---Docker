<?php

namespace App\Models;

use App\Models\Traits\Auth\AuthStatusTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class InternalUser extends Authenticatable
{
    use HasFactory;
    use Notifiable;
    use HasApiTokens;
    use AuthStatusTrait;
}
