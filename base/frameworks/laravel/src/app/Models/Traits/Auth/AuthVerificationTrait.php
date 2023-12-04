<?php

namespace App\Models\Traits\Auth;

use App\Enums\ErrorEnum;
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
            ErrorEnum::NO_USER_EMAIL_ERROR->throw();
        }

        $token = $this->id . '|' . Str::random(40);

        $this->token_for_email_verification = bcrypt($token);
        $this->saveOrFail();

        $hash = Crypt::encrypt([
            'sum' => $this->id,
            'tkn' => $token,
            'exp' => Carbon::now()->addHours(1),
        ]);

        $url = config('app.backoffice_url')
            . '/cuenta?verificationHash='
            . $hash;

        Mail::to($this->email)->send(new AuthVerificationEmail($url));
    }

    public function requestVerificationEmail(): void
    {
        if ($this->email_verified_at) {
            ErrorEnum::ALREADY_VERIFIED_EMAIL_ADDRESS_ERROR->throw();
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
            ErrorEnum::EXPIRED_HASH_ERROR->throw();
        }

        if (!$this->token_for_email_verification || !Hash::check($hashData['tkn'], $this->token_for_email_verification)) {
            ErrorEnum::INVALID_HASH_TOKEN_ERROR->throw();
        }

        if ($this->email_verified_at) {
            ErrorEnum::ALREADY_VERIFIED_EMAIL_ADDRESS_ERROR->throw();
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
