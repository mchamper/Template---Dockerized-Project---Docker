<?php

namespace App\Models;

use App\Core\Bases\BaseModelTrait;
use App\Enums\AppClientStatusEnum;
use App\Models\Traits\AppClient\AppClientTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class AppClient extends Authenticatable
{
    use HasFactory;
    use HasApiTokens;
    use SoftDeletes;
    use BaseModelTrait;
    use AppClientTrait;

    protected $hidden = [
        'secret',
        'scopes',
        'hosts',
    ];

    protected $casts = [
        'scopes' => 'json',
        'hosts' => 'json',
    ];

    protected $enums = [
        'status' => AppClientStatusEnum::class,
    ];
}
