<?php

namespace App\Enums;

enum RoleEnum
{
    use BaseEnum;

    case Root;
    case Admin;
}
