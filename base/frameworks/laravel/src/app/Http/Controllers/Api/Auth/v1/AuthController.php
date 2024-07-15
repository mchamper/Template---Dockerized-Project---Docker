<?php

namespace App\Http\Controllers\Api\Auth\v1;

use App\Core\Response\Response;
use App\Enums\Response\ErrorEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\AuthUserUpdateRequest;
use App\Http\Requests\User\UserLoginAsRequest;
use App\Http\Requests\User\UserLoginGoogleRequest;
use App\Http\Requests\User\UserLoginRequest;
use App\Http\Requests\User\UserRegisterRequest;
use App\Models\SystemUser;
use App\Models\User;
use App\Repositories\SystemUserRepository;
use App\Repositories\UserRepository;
use Carbon\Carbon;
use Google;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Sleep;
use Laravel\Socialite\Two\User as SocialUser;

class AuthController extends Controller
{
    public function register(string $userType)
    {
        $input = Arr::collapse([
            request()->post(),
            request()->file(),
        ]);

        DB::beginTransaction();

        match ($userType) {
            'user' => $user = UserRepository::save(UserRegisterRequest::validate($input, ['userTable' => 'users'])),
            'system-user' => $user = SystemUserRepository::save(UserRegisterRequest::validate($input, ['userTable' => 'system_users'])),
        };

        $user->sendVerificationEmail();

        DB::commit();

        return Response::json([
            'data' => $user,
        ], 'Se le ha enviado un email de verificación a la dirección de correo ingresada.');
    }

    public function login(string $userType)
    {
        $input = request()->post();
        $validated = UserLoginRequest::validate($input);

        match ($userType) {
            'user' => $user = User::whereEmail($validated['email'])->first(),
            'system-user' => $user = SystemUser::whereEmail($validated['email'])->first(),
        };

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            ErrorEnum::InvalidCredentials->throw();
        }

        $user->verifyStatus();

        $expiresAt = $validated['remember_me']
            ? Carbon::now()->addDays(7)
            : Carbon::now()->addMinutes(60);

        DB::beginTransaction();

        $token = $user->createDefaultToken(expiresAt: $expiresAt);

        DB::commit();

        return Response::json([
            'user' => $user,
            'token' => $token->plainTextToken,
            'token_expires_at' => $expiresAt,
        ]);
    }

    public function loginWithGoogle(string $userType)
    {
        $input = request()->post();
        $validated = UserLoginGoogleRequest::validate($input);

        Sleep::for(300)->milliseconds();

        $googleClient = new Google\Client([
            'client_id' => config('services.google.client_id'),
        ]);

        if (!$payload = $googleClient->verifyIdToken($validated['token'])) {
            ErrorEnum::InvalidCredentials->throw();
        }

        $socialUser = (new SocialUser)->setRaw($payload)->map([
            'id' => Arr::get($payload, 'sub'),
            'name' => Arr::get($payload, 'name'),
            'email' => Arr::get($payload, 'email'),
            'avatar' => $avatarUrl = Arr::get($payload, 'picture'),
            'avatar_original' => $avatarUrl,
        ]);

        $socialUserRaw = $socialUser->getRaw();

        match ($userType) {
            'user' => $user = User::whereEmail($socialUser->getEmail())->whereSocialDriverId(1)->first(),
            'system-user' => $user = SystemUser::whereEmail($socialUser->getEmail())->whereSocialDriverId(1)->first(),
        };

        $input = [];

        if (!$user) {
            $input['email'] = $socialUser->getEmail();
            $input['social_driver_id'] = 1;
        } else {
            $user->verifyStatus();
        }

        $input['first_name'] = $socialUserRaw['given_name'] ?? '';
        $input['last_name'] = $socialUserRaw['family_name'] ?? '';
        $input['social_id'] = $socialUser->getId();
        $input['social_avatar'] = $socialUser->getAvatar();

        $expiresAt = Carbon::now()->addHours(12);

        DB::beginTransaction();

        match ($userType) {
            'user' => $user = UserRepository::save($input, $user),
            'system-user' => $user = SystemUserRepository::save($input, $user),
        };

        $user->email_verified_at = $socialUserRaw['email_verified'] ? now() : null;
        $user->saveOrFail();

        $token = $user->createDefaultToken(expiresAt: $expiresAt);

        DB::commit();

        return Response::json([
            'user' => $user,
            'token' => $token->plainTextToken,
            'token_expires_at' => $expiresAt,
        ]);
    }

    public function loginAs()
    {
        $input = request()->post();
        $validated = UserLoginAsRequest::validate($input);

        $systemUser = SystemUser::findOrFail($validated['user_id']);
        $systemUser->verifyStatus();

        $expiresAt = Carbon::now()->addMinutes(60);

        DB::beginTransaction();

        $token = $systemUser->createDefaultToken(expiresAt: $expiresAt, max: 4);

        DB::commit();

        return Response::json([
            'user' => $systemUser,
            'token' => $token->plainTextToken,
            'token_expires_at' => $expiresAt,
        ]);
    }

    /* -------------------- */

    public function me(string $userType)
    {
        return Response::json([
            'user' => auth("api_{$userType}")->user(),
        ]);
    }

    public function update(string $userType)
    {
        $input = request()->post();
        $validated = AuthUserUpdateRequest::validate($input);

        if (empty($validated['password'])) {
            $validated = collect($validated)->except(['password'])->toArray();
        }

        DB::beginTransaction();

        match ($userType) {
            'user' => $user = UserRepository::save($validated, auth("api_{$userType}")->user()),
            'system-user' => $user = SystemUserRepository::save($validated, auth("api_{$userType}")->user()),
        };

        DB::commit();

        return Response::json([
            'user' => $user,
        ], 'Su usuario ha sido actualizado con éxito.');
    }

    public function logout(string $userType)
    {
        $authUser = auth("api_{$userType}")->user();

        $authUser->currentAccessToken()->delete();

        if (request()->query('all')) {
            $authUser->tokens()->delete();
        }

        return Response::json(null, 'La sesión ha sido cerrada con éxito.');
    }
}
