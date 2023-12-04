<?php

namespace App\Http\Controllers\Auth\v1;

use App\Core\Response\Response;
use App\Enums\ErrorEnum;
use App\Enums\SocialDriverEnum;
use App\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\SystemUser\AuthSystemUserUpdateRequest;
use App\Http\Requests\SystemUser\SystemUserLoginGoogleRequest;
use App\Http\Requests\SystemUser\SystemUserLoginRequest;
use App\Http\Requests\SystemUser\SystemUserRegisterRequest;
use App\Models\SystemUser;
use App\Repositories\SystemUserRepository;
use Carbon\Carbon;
use Google;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Two\User as SocialUser;

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

        Auth::verifySystemUser($systemUser);

        $expiresAt = $validated['remember_me']
            ? Carbon::now()->addDays(7)
            : Carbon::now()->addMinutes(60);

        DB::beginTransaction();

        // $systemUser->tokens()->delete();

        $token = $systemUser->createToken(
            name: 'app_client|' . Auth::appClient()->id,
            expiresAt: $expiresAt,
        );

        DB::commit();

        return Response::json([
            'data' => $systemUser,
            'token' => $token->plainTextToken,
            'token_expires_at' => $expiresAt,
        ]);
    }

    public function loginGoogle()
    {
        $input = request()->post();
        $validated = Validator::make($input, SystemUserLoginGoogleRequest::rules())->validate();

        sleep(1);

        $googleClient = new Google\Client([
            'client_id' => config('services.google.client_id'),
        ]);

        if (!$payload = $googleClient->verifyIdToken($validated['token'])) {
            ErrorEnum::INVALID_CREDENTIALS_ERROR->throw();
        }

        $socialUser = (new SocialUser)->setRaw($payload)->map([
            'id' => Arr::get($payload, 'sub'),
            'name' => Arr::get($payload, 'name'),
            'email' => Arr::get($payload, 'email'),
            'avatar' => $avatarUrl = Arr::get($payload, 'picture'),
            'avatar_original' => $avatarUrl,
        ]);

        $socialUserRaw = $socialUser->getRaw();

        $input = [];
        $systemUser = SystemUser::whereEmail($socialUser->getEmail())->whereSocialDriver(SocialDriverEnum::Google->value())->first();

        if (!$systemUser) {
            $input['email'] = $socialUser->getEmail();
            $input['social_driver'] = SocialDriverEnum::Google;
        } else {
            Auth::verifySystemUser($systemUser);
        }

        $input['first_name'] = $socialUserRaw['given_name'] ?? '';
        $input['last_name'] = $socialUserRaw['family_name'] ?? '';
        $input['social_id'] = $socialUser->getId();
        $input['social_avatar'] = $socialUser->getAvatar();

        $expiresAt = Carbon::now()->addHours(12);

        DB::beginTransaction();

        $systemUser = SystemUserRepository::save($input, $systemUser);

        $systemUser->email_verified_at = $socialUserRaw['email_verified'] ? now() : null;
        $systemUser->saveOrFail();

        // $systemUser->tokens()->delete();

        $token = $systemUser->createToken(
            name: 'app_client|' . Auth::appClient()->id,
            expiresAt: $expiresAt,
        );

        DB::commit();

        return Response::json([
            'data' => $systemUser,
            'token' => $token->plainTextToken,
            'token_expires_at' => $expiresAt,
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
