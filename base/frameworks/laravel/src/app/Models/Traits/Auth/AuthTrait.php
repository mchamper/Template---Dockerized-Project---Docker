<?php

namespace App\Models\Traits\Auth;

trait AuthTrait
{
    use AuthStatusTrait;
    use AuthVerificationTrait;
    use AuthPasswordResetTrait;
    use AuthTokenTrait;
}
