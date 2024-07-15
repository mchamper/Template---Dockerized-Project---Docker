<?php

namespace App\Http\Controllers\Api\Auth\v1;

use App\Core\Response\Response;
use App\Enums\Response\ErrorEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserLoginRequest;
use App\Http\Requests\User\UserRegisterRequest;
use App\Models\SystemUser;
use App\Models\User;
use App\Repositories\SystemUserRepository;
use App\Repositories\UserRepository;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

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

        $token = $user->createToken(
            name: request()->header('User-Agent'),
            expiresAt: $expiresAt,
        );

        DB::commit();

        return Response::json([
            'data' => $user,
            'token' => $token->plainTextToken,
            'token_expires_at' => $expiresAt,
        ]);
    }

    public function me(string $userType)
    {
        return Response::json([
            'data' => auth("api:{$userType}")->user(),
        ]);
    }
}
