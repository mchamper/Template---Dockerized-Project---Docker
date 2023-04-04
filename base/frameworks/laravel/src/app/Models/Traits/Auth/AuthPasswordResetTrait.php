<?php

namespace App\Models\Traits\Auth;

use App\Commons\Response\ErrorEnum;
use App\Commons\Response\ErrorEnumException;
use App\Commons\Response\ErrorException;
use App\Mail\AuthPasswordResetEmail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

trait AuthPasswordResetTrait
{
    public function sendPasswordResetEmail()
    {
        if (!$this->email) {
            throw new ErrorEnumException(ErrorEnum::NO_USER_EMAIL_ERROR);
        }

        $token = $this->id . '|' . Str::random(40);

        $this->token_for_password_reset = bcrypt($token);
        $this->saveOrFail();

        $hash = Crypt::encrypt([
            'sum' => $this->id,
            'tkn' => $token,
            'exp' => Carbon::now()->addHour(1),
        ]);

        $url = config('app.backoffice_url')
            . '/bienvenido?passwordResetHash='
            . $hash;

        Mail::to($this->email)->send(new AuthPasswordResetEmail($url));
    }

    public static function requestPasswordResetEmail(array $input): void
    {
        $validated = Validator::make($input, [
            'email' => 'bail|required|email',
        ])->validate();

        if (!$user = static::where('email', $validated['email'])->first()) {
            throw new ErrorEnumException(ErrorEnum::NOT_USER_FOUND_WITH_EMAIL_ERROR);
        }

        $user->sendPasswordResetEmail();
    }

    public static function getHashDataFromPasswordResetRequest(array $input): array
    {
        $validated = Validator::make($input, [
            'hash' => 'bail|required|string',
        ])->validate();

        $hashData = Crypt::decrypt($validated['hash']);

        if (Carbon::now() > $hashData['exp']) {
            throw new ErrorEnumException(ErrorEnum::EXPIRED_HASH_ERROR);
        }

        if (!$user = static::where('id', $hashData['sum'])->first()) {
            throw new ErrorEnumException(ErrorEnum::NOT_USER_FOUND_IN_HASH);
        }

        if (!Hash::check($hashData['tkn'], $user->token_for_password_reset)) {
            throw new ErrorEnumException(ErrorEnum::INVALID_HASH_TOKEN_ERROR);
        }

        return [
            'data' => $hashData,
            'user' => $user,
        ];
    }

    public static function updatePasswordFromPasswordResetRequest(array $input): void
    {
        $validated = Validator::make($input, [
            'hash' => 'bail|required|string',
            'password' => ['bail', 'required', 'string', 'confirmed', Password::min(6)]
        ])->validate();

        $hashData = self::getHashDataFromPasswordResetRequest($input);
        $user = $hashData['user'];

        $user->password = $validated['password'];
        $user->token_for_password_reset = null;
        $user->saveOrFail();
    }
}
