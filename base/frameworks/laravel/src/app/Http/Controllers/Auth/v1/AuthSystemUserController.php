<?php

namespace App\Http\Controllers\Auth\v1;

use App\Commons\Auth\Auth;
use App\Commons\Response\ErrorEnum;
use App\Commons\Response\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\SystemUser\AuthSystemUserUpdateRequest;
use App\Http\Requests\SystemUser\SystemUserLoginRequest;
use App\Http\Requests\SystemUser\SystemUserRegisterRequest;
use App\Models\SystemUser;
use App\Repositories\SystemUserRepository;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthSystemUserController extends Controller
{
    public function register()
    {
        $input = Arr::collapse([
            request()->post(),
            request()->file(),
        ]);

        $validated = Validator::make($input, SystemUserRegisterRequest::rules())->validate();

        DB::beginTransaction();

        $systemUser = SystemUserRepository::save($validated);
        $systemUser->sendVerificationEmail();

        DB::commit();

        return Response::json([
            'data' => $systemUser,
        ], 'Se le ha enviado un email de verificación a la dirección de correo ingresada.');
    }

    public function login()
    {
        $input = request()->post();
        $validated = Validator::make($input, SystemUserLoginRequest::rules())->validate();

        $systemUser = SystemUser::whereEmail($validated['email'])->first();

        if (!$systemUser || !Hash::check($validated['password'], $systemUser->password)) {
            ErrorEnum::INVALID_CREDENTIALS_ERROR->throw();
        }

        Auth::systemUserCheck($systemUser);

        $expiresAt = Carbon::now()->addMinutes(60);

        if ($validated['remember_me']) {
            $expiresAt = Carbon::now()->addDays(7);
        }

        DB::beginTransaction();

        $systemUser->tokens()->delete();

        $token = $systemUser->createToken(
            name: 'app_client|' . Auth::appClient()->id,
            expiresAt: $expiresAt,
        );

        DB::commit();

        return Response::json([
            'data' => $systemUser,
            'token' => $token->plainTextToken,
        ]);
    }

    public function logout()
    {
        Auth::systemUser()->currentAccessToken()->delete();
        return Response::json(null, 'La sesión ha sido cerrada con éxito.');
    }

    public function me()
    {
        return Response::json([
            'data' => Auth::systemUser(),
        ]);
    }

    public function update()
    {
        $input = request()->post();
        $validated = Validator::make($input, AuthSystemUserUpdateRequest::rules())->validate();

        if (empty($validated['password'])) {
            $validated = collect($validated)->except(['password'])->toArray();
        }

        DB::beginTransaction();

        $systemUser = SystemUserRepository::save($validated, Auth::systemUser());

        DB::commit();

        return Response::json([
            'data' => $systemUser,
        ], 'Tu usuario ha sido actualizado con éxito.');
    }
}
