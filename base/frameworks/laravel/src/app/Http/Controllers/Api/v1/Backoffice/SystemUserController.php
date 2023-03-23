<?php

namespace App\Http\Controllers\Api\v1\Backoffice;

use App\Commons\Response\Response;
use App\Commons\RESTful\RESTful;
use App\Http\Controllers\Controller;
use App\Models\SystemUser;

class SystemUserController extends Controller
{
    public function index()
    {
        $systemUsers = (new RESTful(
            SystemUser::query(),
            request()->query(),
        ))->paginate();

        return Response::json([
            'system_users' => $systemUsers,
        ]);
    }
}
