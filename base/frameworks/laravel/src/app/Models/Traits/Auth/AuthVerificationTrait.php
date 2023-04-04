<?php

namespace App\Models\Traits\Auth;

use App\Commons\Response\ErrorEnum;
use App\Commons\Response\ErrorEnumException;
use App\Mail\AuthVerificationEmail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

trait AuthVerificationTrait
{
    public function sendVerificationEmail(): void
    {
        if (!$this->email) {
            throw new ErrorEnumException(ErrorEnum::NO_USER_EMAIL_ERROR);
        }

        $token = $this->id . '|' . Str::random(40);

        $this->token_for_email_verification = bcrypt($token);
        $this->saveOrFail();

        $hash = Crypt::encrypt([
            'sum' => $this->id,
            'tkn' => $token,
            'exp' => Carbon::now()->addHour(1),
        ]);

        $url = config('app.backoffice_url')
            . '/cuenta?verificationHash='
            . $hash;

        Mail::to($this->email)->send(new AuthVerificationEmail($url));
    }

    public function requestVerificationEmail(): void
    {
        if ($this->email_verified_at) {
            throw new ErrorEnumException(ErrorEnum::ALREADY_VERIFIED_EMAIL_ADDRESS_ERROR);
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
            throw new ErrorEnumException(ErrorEnum::EXPIRED_HASH_ERROR);
        }

        if (!Hash::check($hashData['tkn'], $this->token_for_email_verification)) {
            throw new ErrorEnumException(ErrorEnum::INVALID_HASH_TOKEN_ERROR);
        }

        if ($this->email_verified_at) {
            throw new ErrorEnumException(ErrorEnum::ALREADY_VERIFIED_EMAIL_ADDRESS_ERROR);
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
