<?php

namespace App\Models\Traits\SystemUser;

use App\Commons\Response\ErrorException;
use App\Mail\SystemUserPasswordResetEmail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

trait SysemUserPasswordResetTrait
{
    public function sendPasswordResetEmail()
    {
        if (!$this->email) {
            throw new ErrorException('Este usuario no tiene una dirección de correo para enviar.', 400);
        }

        $token = $this->id . '|' . Str::random(40);

        $this->token_for_password_reset = $token;
        $this->saveOrFail();

        $hash = Crypt::encrypt([
            'sum' => $this->id,
            'tkn' => $token,
            'exp' => Carbon::now()->addHour(1),
        ]);

        $url = config('app.backoffice_url')
            . '/bienvenido?passwordResetHash='
            . $hash;

        Mail::to($this->email)->send(new SystemUserPasswordResetEmail($this, $url));
    }

    public static function requestPasswordResetEmail(array $input): void
    {
        $validated = Validator::make($input, [
            'email' => 'bail|required|email',
        ])->validate();

        if (!$systemUser = static::where('email', $validated['email'])->first()) {
            throw new ErrorException('No se ha encontrado ningún usuario con esta dirección de correo.', 404);
        }

        $systemUser->sendPasswordResetEmail();
    }

    public static function getHashDataFromPasswordResetRequest(array $input): array
    {
        $validated = Validator::make($input, [
            'hash' => 'bail|required|string',
        ])->validate();

        $hashData = Crypt::decrypt($validated['hash']);

        if (Carbon::now() > $hashData['exp']) {
            throw new ErrorException('Este hash ha expirado.', 403);
        }

        if (!$systemUser = static::where('id', $hashData['sum'])->first()) {
            throw new ErrorException('No se ha encontrado ningún usuario correspondiente a este hash.', 404);
        }

        if (!Hash::check($hashData['tkn'], $systemUser->token_for_password_reset)) {
            throw new ErrorException('El token del hash es incorrecto o ha caducado.', 400);
        }

        return [
            'data' => $hashData,
            'system_user' => $systemUser,
        ];
    }

    public static function updatePasswordFromPasswordResetRequest(array $input): void
    {
        $validated = Validator::make($input, [
            'hash' => 'bail|required|string',
            'password' => ['bail', 'required', 'string', 'confirmed', Password::min(6)]
        ])->validate();

        $hashData = self::getHashDataFromPasswordResetRequest($input);
        $systemUser = $hashData['system_user'];

        $systemUser->password = $validated['password'];
        $systemUser->token_for_password_reset = null;
        $systemUser->saveOrFail();
    }
}
