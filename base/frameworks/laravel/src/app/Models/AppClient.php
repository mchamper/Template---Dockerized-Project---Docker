<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class AppClient extends Authenticatable
{
    use HasFactory,
        HasApiTokens,
        SoftDeletes;

    protected $casts = [
        'scopes' => 'json',
        'hosts' => 'json',
    ];
}
