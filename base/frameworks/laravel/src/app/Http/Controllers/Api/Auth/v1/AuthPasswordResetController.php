<?php

namespace App\Http\Controllers\Api\Auth\v1;

use App\Core\Response\Response;
use App\Http\Controllers\Controller;
use App\Models\SystemUser;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AuthPasswordResetController extends Controller
{
    private function _getUserClass(string $userType): User|SystemUser
    {
        return match ($userType) {
            'user' => new User,
            'system-user' => new SystemUser,
        };
    }

    /* -------------------- */

    public function request(string $userType)
    {
        $this->_getUserClass($userType)->requestPasswordResetEmail(request()->post());

        return Response::json(null, 'El email de cambio de contraseña ha sido enviado con éxito.');
    }

    public function update(string $userType)
    {
        DB::beginTransaction();

        $this->_getUserClass($userType)->updatePasswordFromPasswordResetRequest(request()->all());

        DB::commit();

        return Response::json(null, 'Tu contraseña ha sido actualizada con éxito.');
    }
}
