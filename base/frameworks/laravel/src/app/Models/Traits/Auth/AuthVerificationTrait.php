<?php

namespace App\Models\Traits\Auth;

use App\Enums\Response\ErrorEnum;
use App\Mail\AuthVerificationEmail;
use App\Models\ExternalUser;
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
            ErrorEnum::NoUserEmail->throw();
        }

        $token = $this->id . '|' . Str::random(40);

        $this->token_for_email_verification = bcrypt($token);
        $this->saveOrFail();

        $hash = Crypt::encrypt([
            'sum' => $this->id,
            'tkn' => $token,
            'exp' => Carbon::now()->addHours(1),
        ]);

        if ($this instanceof ExternalUser) {
            $url = config('app.url')
                . '/api/auth/v1/external-user/verification/verify?hash='
                . $hash;
        } else {
            $url = config('app.backoffice_url')
                . '/cuenta?verificationHash='
                . $hash;
        }


        Mail::to($this->email)->send(new AuthVerificationEmail($url));
    }

    public function requestVerificationEmail(): void
    {
        if ($this->email_verified_at) {
            ErrorEnum::AlreadyVerifiedEmailAddress->throw();
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
            ErrorEnum::ExpiredHash->throw();
        }

        if (!$this->token_for_email_verification || !Hash::check($hashData['tkn'], $this->token_for_email_verification)) {
            ErrorEnum::InvalidHashToken->throw();
        }

        if ($this->email_verified_at) {
            ErrorEnum::AlreadyVerifiedEmailAddress->throw();
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
