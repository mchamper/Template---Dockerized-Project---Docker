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
        $systemUserQuery = SystemUser::noRoot()->noAuth();

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
        $systemUserQuery = SystemUser::noRoot()->noAuth();

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
        $this->authorize('create', SystemUser::class);

        $input = request()->post();
        $validated = Validator::make($input, SystemUserCreateRequest::rules())->validate();

        DB::beginTransaction();

        if ($validated['password_input_type'] === 'random') {
            $randomPassword = Str::password();
            $validated['password'] = $randomPassword;
        }

        $systemUser = SystemUserRepository::save($validated);

        if ($validated['require_email_verification']) {
            $systemUser->sendVerificationEmail();
        } else {
            $systemUser->email_verified_at = now();
            $systemUser->saveOrFail();
        }

        DB::commit();

        return Response::json([
            'system_user' => $systemUser,
            'system_user_password' => $randomPassword ?? null,
        ], 'El usuario ha sido creado con éxito.');

    }

    public function update(int $systemUserId)
    {
        $systemUser = SystemUser::noRoot()->noAuth()->findOrFail($systemUserId);

        $this->authorize('update', $systemUser);

        $input = request()->post();
        $validated = Validator::make($input, SystemUserUpdateRequest::rules())->validate();

        if (empty($validated['password'])) {
            $validated = collect($validated)->except(['password'])->toArray();
        }

        DB::beginTransaction();

        $systemUser = SystemUserRepository::save($validated, $systemUser);

        DB::commit();

        return Response::json([
            'system_user' => $systemUser,
        ], 'El usuario ha sido actualizado con éxito.');

    }

    public function delete(int $systemUserId)
    {
        $systemUser = SystemUser::noRoot()->noAuth()->findOrFail($systemUserId);

        $this->authorize('delete', $systemUser);

        DB::beginTransaction();

        $systemUser->delete();

        DB::commit();

        return Response::json([
            'system_user' => $systemUser,
        ], 'El usuario ha sido eliminado con éxito.');
    }

    /* -------------------- */

    public function activate(int $systemUserId)
    {
        $systemUser = SystemUser::noRoot()->noAuth()->findOrFail($systemUserId);

        $this->authorize('update', $systemUser);

        DB::beginTransaction();

        $systemUser->status = SystemUserStatusEnum::Active;
        $systemUser->saveOrFail();

        DB::commit();

        return Response::json([
            'system_user' => $systemUser,
        ], 'El usuario ha sido activado con éxito.');
    }

    public function deactivate(int $systemUserId)
    {
        $systemUser = SystemUser::noRoot()->noAuth()->findOrFail($systemUserId);

        $this->authorize('update', $systemUser);

        DB::beginTransaction();

        $systemUser->status = SystemUserStatusEnum::Inactive;
        $systemUser->saveOrFail();

        DB::commit();

        return Response::json([
            'system_user' => $systemUser,
        ], 'El usuario ha sido desactivado con éxito.');
    }
}
