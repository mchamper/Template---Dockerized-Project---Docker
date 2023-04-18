<?php

namespace App\Http\Controllers\Auth\v1;

use App\Commons\Auth\Auth;
use App\Commons\Response\ErrorEnum;
use App\Commons\Response\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\AppClient\AppClientLoginRequest;
use App\Models\AppClient;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthAppClientController extends Controller
{
    public function login()
    {
        $input = request()->post();
        $validated = Validator::make($input, AppClientLoginRequest::rules())->validate();

        $appClient = AppClient::where('key', $validated['key'])->first();

        if (!$appClient || !Hash::check($validated['secret'], $appClient->secret)) {
            ErrorEnum::INVALID_CREDENTIALS_ERROR->throw();
        }

        Auth::appClientCheck($appClient);

        // $appClient->tokens()->delete();

        $token = $appClient->createToken(
            name: '',
        );

        return Response::json([
            'token' => $token->plainTextToken,
        ]);
    }

    public function logout()
    {
        Auth::appClient()->currentAccessToken()->delete();
        return Response::json(null, 'La sesión ha sido cerrada con éxito.');
    }

    public function me()
    {
        return Response::json();
    }
}
