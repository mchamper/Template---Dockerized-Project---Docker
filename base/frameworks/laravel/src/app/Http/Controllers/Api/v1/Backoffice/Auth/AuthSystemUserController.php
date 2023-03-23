<?php

namespace App\Http\Controllers\Api\v1\Backoffice\Auth;

use App\Commons\Auth\Auth;
use App\Commons\Response\Response;
use App\Data\SystemUser\SystemUserLoginData;
use App\Data\SystemUser\SystemUserRegisterData;
use App\Http\Controllers\Controller;
use App\Models\SystemUser;
use App\Repositories\SystemUserRepository;
use Carbon\Carbon;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthSystemUserController extends Controller
{
    public function register()
    {
        $input = Arr::collapse([
            request()->post(),
            request()->file(),
        ]);

        $systemUserRegisterData = SystemUserRegisterData::validateAndCreate($input);

        DB::beginTransaction();

        $systemUser = SystemUserRepository::save($systemUserRegisterData);
        $systemUser->sendVerificationEmail();

        DB::commit();

        return Response::json([
            'system_user' => $systemUser,
        ], 'Se le ha enviado un email de verificación a la dirección de correo ingresada.');
    }

    public function login()
    {
        $input = request()->post();
        $systemUserLoginData = SystemUserLoginData::validateAndCreate($input);

        $authSystemUser = SystemUser::whereEmail($systemUserLoginData->email)->first();

        if (!$authSystemUser || !Hash::check($systemUserLoginData->password, $authSystemUser->password)) {
            throw new AuthenticationException('Las credenciales provistas son incorrectas.');
        }

        $expiresAt = Carbon::now()->addMinutes(120);

        if ($systemUserLoginData->remember_me) {
            $expiresAt = Carbon::now()->addMonth();
        }

        $authSystemUser->tokens()->delete();

        $token = $authSystemUser->createToken(
            name: 'ch:backoffice',
            expiresAt: $expiresAt,
        );

        return Response::json([
            'auth_system_user' => $authSystemUser,
            'token' => $token->plainTextToken,
        ]);
    }

    public function me()
    {
        return Response::json([
            'auth_system_user' => Auth::apiSystemUser(),
        ]);
    }
}
