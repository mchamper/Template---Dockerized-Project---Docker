<?php

namespace App\Models\Traits\Auth;
use App\Enums\Response\ErrorEnum;
use DateTimeInterface;

trait AuthTokenTrait
{
    public function createDefaultToken(?string $name = null, ?DateTimeInterface $expiresAt = null, $max = 3)
    {
        if ($this->tokens()->count() >= $max) {
            ErrorEnum::MaxTokensAllowed->throw();
        }

        return $this->createToken(
            name: $name ?: request()->header('User-Agent'),
            expiresAt: $expiresAt,
        );
    }
}
