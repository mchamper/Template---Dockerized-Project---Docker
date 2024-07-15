<?php

namespace App\Http\Controllers\Api\Auth\v1;

use App\Core\Response\Response;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class AuthVerificationController extends Controller
{
    public function request(string $userType)
    {
        auth("api_{$userType}")->user()->requestVerificationEmail();

        return Response::json(null, 'El email de verificación ha sido enviado con éxito.');
    }

    public function verify(string $userType)
    {
        DB::beginTransaction();

        auth("api_{$userType}")->user()->verifyFromVerificationRequest(request()->query());

        DB::commit();

        return Response::json(null, 'La dirección de correo ha sido verificada con éxito.');
    }
}
