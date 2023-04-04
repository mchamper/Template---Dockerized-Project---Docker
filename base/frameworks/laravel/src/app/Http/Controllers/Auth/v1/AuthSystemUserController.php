<?php

namespace App\Http\Controllers\Auth\v1;

use App\Commons\Auth\Auth;
use App\Commons\Response\ErrorEnum;
use App\Commons\Response\ErrorEnumException;
use App\Commons\Response\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\SystemUser\SystemUserLoginRequest;
use App\Http\Requests\SystemUser\SystemUserLoginWithGoogleRequest;
use App\Http\Requests\SystemUser\SystemUserRegisterRequest;
use App\Models\SystemUser;
use App\Repositories\SystemUserRepository;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Two\User as SocialiteUser;

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
            throw new ErrorEnumException(ErrorEnum::INVALID_CREDENTIALS_ERROR);
        }

        Auth::systemUserCheck();

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

    public function loginWithGoogle()
    {
        $input = request()->post();
        $validated = Validator::make($input, SystemUserLoginWithGoogleRequest::rules())->validate();

        $googleClient = new Google\Client([
            'client_id' => config('services.google.client_id'),
        ]);

        if (!$payload = $googleClient->verifyIdToken($validated['token'])) {
            throw new ErrorEnumException(ErrorEnum::INVALID_CREDENTIALS_ERROR);
        }

        $socialUser = (new SocialiteUser)->setRaw($payload)->map([
            'id' => Arr::get($payload, 'sub'),
            'name' => Arr::get($payload, 'name'),
            'email' => Arr::get($payload, 'email'),
            'avatar' => $avatarUrl = Arr::get($payload, 'picture'),
            'avatar_original' => $avatarUrl,
        ]);

        if (!$systemUser = SystemUser::whereEmail($socialUser->getEmail())->first()) {
            $systemUser = new SystemUser();
            $systemUser->email = $socialUser->getEmail();
            $systemUser->socialite_driver = 'google';
        }

        DB::beginTransaction();

        $systemUser->name = $socialUser->getName();
        $systemUser->picture = $socialUser->getAvatar();
        $systemUser->socialite_id = $socialUser->getId();
        $systemUser->saveOrFail();

        $expiresAt = Carbon::now()->addMinutes(60);

        if ($validated['remember_me']) {
            $expiresAt = Carbon::now()->addDays(7);
        }

        $systemUser->tokens()->delete();

        $token = $systemUser->createToken(
            name: 'app_client|' . Auth::appClient()->id,
            expiresAt: $expiresAt,
        );

        DB::commit();

        return Response::json([
            'data' => $authSystemUser,
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
}
