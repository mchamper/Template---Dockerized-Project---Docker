<?php

namespace App\Http\Controllers\Api\Backoffice\v1;

use App\Core\Response\Response;
use App\Core\RESTful\RESTful;
use App\Enums\SystemUserStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\SystemUser\SystemUserCreateRequest;
use App\Http\Requests\SystemUser\SystemUserUpdateRequest;
use App\Models\SystemUser;
use App\Repositories\SystemUserRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class SystemUserController extends Controller
{
    public function index()
    {
        $systemUserQuery = SystemUser::noRoot();

        $systemUsers = (new RESTful(
            $systemUserQuery,
            request()->query(),
        ))->paginate();

        return Response::json([
            'system_users' => $systemUsers,
        ]);
    }

    public function show(int $systemUserId)
    {
        $systemUserQuery = SystemUser::noRoot();

        $systemUser = (new RESTful(
            $systemUserQuery,
            request()->query(),
        ))->findOrFail($systemUserId);

        return Response::json([
            'system_user' => $systemUser,
        ]);
    }

    public function create()
    {
        $input = request()->post();
        $validated = Validator::make($input, SystemUserCreateRequest::rules())->validate();

        DB::beginTransaction();

        if ($validated['password_input_type'] === 'random') {
            $randomPassword = Str::password();
            $validated['password'] = $randomPassword;
        }

        $systemUser = SystemUserRepository::save($validated);
        $systemUser->sendVerificationEmail();

        DB::commit();

        return Response::json([
            'system_user' => $systemUser,
            'system_user_password' => $randomPassword ?? null,
        ], 'El usuario ha sido creado con éxito.');

    }
    public function update(int $systemUserId)
    {
        $systemUser = SystemUser::noRoot()->noAuth()->findOrFail($systemUserId);

        $input = request()->post();
        $validated = Validator::make($input, SystemUserUpdateRequest::rules())->validate();

        DB::beginTransaction();

        $systemUser = SystemUserRepository::save($validated, $systemUser);

        DB::commit();

        return Response::json([
            'system_user' => $systemUser,
        ], 'El usuario provisto ha sido actualizado con éxito.');
    }

    public function delete(int $systemUserId)
    {
        $systemUser = SystemUser::noRoot()->noAuth()->findOrFail($systemUserId);

        DB::beginTransaction();

        $systemUser->delete();

        DB::commit();

        return Response::json([
            'system_user' => $systemUser,
        ], 'El usuario provisto ha sido eliminado con éxito.');
    }

    /* -------------------- */

    public function activate(int $systemUserId)
    {
        $systemUser = SystemUser::noRoot()->noAuth()->findOrFail($systemUserId);

        DB::beginTransaction();

        $systemUser->status = SystemUserStatusEnum::Active;
        $systemUser->saveOrFail();

        DB::commit();

        return Response::json([
            'system_user' => $systemUser,
        ], 'El usuario provisto ha sido activado con éxito.');
    }

    public function deactivate(int $systemUserId)
    {
        $systemUser = SystemUser::noRoot()->noAuth()->findOrFail($systemUserId);

        DB::beginTransaction();

        $systemUser->status = SystemUserStatusEnum::Inactive;
        $systemUser->saveOrFail();

        DB::commit();

        return Response::json([
            'system_user' => $systemUser,
        ], 'El usuario provisto ha sido desactivado con éxito.');
    }
}
