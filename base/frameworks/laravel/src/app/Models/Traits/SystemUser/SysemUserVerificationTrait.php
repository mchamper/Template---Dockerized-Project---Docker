<?php

namespace App\Models\Traits\SystemUser;

use App\Commons\Response\ErrorException;
use App\Mail\SystemUserVerificationEmail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

trait SysemUserVerificationTrait
{
    public function sendVerificationEmail(): void
    {
        if (!$this->email) {
            throw new ErrorException('Este usuario no tiene una dirección de correo para enviar.', 400);
        }

        $token = $this->id . '|' . Str::random(40);

        $this->token_for_email_verification = $token;
        $this->saveOrFail();

        $hash = Crypt::encrypt([
            'sum' => $this->id,
            'tkn' => $token,
            'exp' => Carbon::now()->addHour(1),
        ]);

        $url = config('app.backoffice_url')
            . '/cuenta?verificationHash='
            . $hash;

        Mail::to($this->email)->send(new SystemUserVerificationEmail($this, $url));
    }

    public function requestVerificationEmail(): void
    {
        if ($this->email_verified_at) {
            throw new ErrorException('Esta dirección de correo ya ha sido verificada.', 400);
        }

        $this->sendVerificationEmail();
    }

    public function getHashDataFromVerificationRequest(array $input): array
    {
        $validated = Validator::make($input, [
            'hash' => 'bail|required|string',
        ])->validate();

        $hashData = Crypt::decrypt($validated['hash']);

        if (Carbon::now() > $hashData['exp']) {
            throw new ErrorException('Este hash ha expirado.', 403);
        }

        if (!Hash::check($hashData['tkn'], $this->token_for_email_verification)) {
            throw new ErrorException('El token del hash es incorrecto o ha caducado.', 400);
        }

        if ($this->email_verified_at) {
            throw new ErrorException('Esta dirección de correo ya ha sido verificada.', 400);
        }

        return [
            'data' => $hashData,
        ];
    }

    public function verifyFromVerificationRequest(array $input): void
    {
        Validator::make($input, [
            'hash' => 'bail|required|string',
        ])->validate();

        $this->getHashDataFromVerificationRequest($input);

        $this->email_verified_at = Carbon::now();
        $this->token_for_email_verification = null;
        $this->saveOrFail();
    }
}
