<?php

namespace App\Models\Traits\SystemUser;

use App\Commons\Response\ErrorEnum;
use App\Enums\SystemUserStatusEnum;

trait SystemUserTrait
{
    public function verifyStatus()
    {
        if (!$this->status->is(SystemUserStatusEnum::Active)) {
            ErrorEnum::INACTIVE_USER_ERROR->throw();
        }
    }
}
