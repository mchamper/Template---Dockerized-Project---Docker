<?php

namespace App\Http\Controllers\Api\v1\Backoffice\Auth;

use App\Commons\Auth\Auth;
use App\Commons\Response\Response;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class AuthSystemUserVerificationController extends Controller
{
    public function request()
    {
        Auth::apiSystemUser()->requestVerificationEmail(request()->post());

        return Response::json(null, 'El email de verificación ha sido enviado con éxito.');
    }

    public function verify()
    {
        DB::beginTransaction();

        Auth::apiSystemUser()->verifyFromVerificationRequest(request()->query());

        DB::commit();

        return Response::json(null, 'Tu dirección de correo ha sido verificada con éxito.');
    }
}
