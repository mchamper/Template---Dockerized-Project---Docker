<?php

namespace App\Http\Controllers\Auth\v1;

use App\Commons\Response\Response;
use App\Http\Controllers\Controller;
use App\Models\SystemUser;
use Illuminate\Support\Facades\DB;

class AuthSystemUserPasswordResetController extends Controller
{
    public function request()
    {
        SystemUser::requestPasswordResetEmail(request()->post());

        return Response::json(null, 'El email de cambio de contraseña ha sido enviado con éxito.');
    }

    public function update()
    {
        DB::beginTransaction();

        SystemUser::updatePasswordFromPasswordResetRequest(request()->all());

        DB::commit();

        return Response::json(null, 'Tu contraseña ha sido actualizada con éxito.');
    }
}
