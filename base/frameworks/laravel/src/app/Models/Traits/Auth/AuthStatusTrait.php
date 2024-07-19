<?php

namespace App\Models\Traits\Auth;

use App\Enums\Response\ErrorEnum;

trait AuthStatusTrait
{
    public function verifyStatus()
    {
        if ($this->status_id !== 1) {
            ErrorEnum::InactiveUser->throw();
        }
    }
}
