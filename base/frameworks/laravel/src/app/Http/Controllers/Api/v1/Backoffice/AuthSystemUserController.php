<?php

namespace App\Http\Controllers\Api\v1\Backoffice;

use App\Commons\Auth\Auth;
use App\Commons\Response\Response;
use App\Http\Controllers\Controller;
use App\Models\SystemUser;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthSystemUserController extends Controller
{
    protected $_claims = [
        'chn' => 'backoffice'
    ];

    /* -------------------- */

    public function login()
    {
        $input = request()->post();

        $validated = Validator::make($input, [
            'email' => 'bail|required|email',
            'password' => 'bail|required|string',
            'remember_me' => 'bail|boolean'
        ])->validate();

        $systemUser = SystemUser::whereisActive(1)
            ->whereEmail($validated['email'])
            ->first()
            ;

        if (!$systemUser || !Hash::check($validated['password'], $systemUser->password)) {
            throw new AuthenticationException('Invalid crendentials.');
        }

        array_key_exists('remember_me', $validated) && $validated['remember_me'] ?
            $ttl = 60 * 24 * 7: // 1 semana.
            $ttl = 60 * 2; // 2 horas.

        if (app()->environment('local')) {
            $ttl = 5259600; // 10 años.
        }

        if (!$token = Auth::apiSystemUserGuard()->setTTL($ttl)->claims($this->_claims)->login($systemUser)) {
            throw new AuthenticationException();
        }

        return Response::json([
            'token' => $token,
            'auth_system_user' => Auth::apiSystemUser(),
        ]);
    }

    /* -------------------- */

    public function me()
    {
        return Response::json([
            'auth_system_user' => Auth::apiSystemUser(),
        ]);
    }
}
