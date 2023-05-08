<?php

namespace App\Enums;

enum PermissionEnum
{
    use BaseEnum;

    case SystemUserCreate;
    case SystemUserUpdate;
    case SystemUserDelete;
    case SystemUserActivate;
    case SystemUserDeactivate;
}
