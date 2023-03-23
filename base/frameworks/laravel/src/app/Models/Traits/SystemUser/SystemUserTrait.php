<?php

namespace App\Models\Traits\SystemUser;

trait SystemUserTrait
{
    use SysemUserVerificationTrait,
        SysemUserPasswordResetTrait;
}
