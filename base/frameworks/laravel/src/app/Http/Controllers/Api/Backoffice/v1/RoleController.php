<?php

namespace App\Http\Controllers\Api\Backoffice\v1;

use App\Core\Response\Response;
use App\Core\RESTful\RESTful;
use App\Http\Controllers\Controller;
use App\Http\Requests\Role\RoleCreateRequest;
use App\Http\Requests\Role\RoleSyncPermissionRequest;
use App\Http\Requests\Role\RoleUpdateRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        $roleQuery = Role::query();

        $roles = (new RESTful(
            $roleQuery,
            request()->query(),
        ))->paginate();

        return Response::json([
            'roles' => $roles,
        ]);
    }

    public function show(int $roleId)
    {
        $roleQuery = Role::query();

        $role = (new RESTful(
            $roleQuery,
            request()->query(),
        ))->findOrFail($roleId);

        return Response::json([
            'role' => $role,
        ]);
    }

    public function create()
    {
        $input = request()->post();
        $validated = Validator::make($input, RoleCreateRequest::rules())->validate();

        DB::beginTransaction();

        $role = new Role();
        $role->name = $validated['name'];
        $role->guard_name = $validated['guard_name'];
        $role->saveOrFail();

        DB::commit();

        return Response::json([
            'role' => $role,
        ], 'El rol ha sido creado con éxito.');

    }

    public function update(int $roleId)
    {
        $role = Role::whereNotNull('created_at')->findOrFail($roleId);

        $input = request()->post();
        $validated = Validator::make($input, RoleUpdateRequest::rules())->validate();

        DB::beginTransaction();

        $role->name = $validated['name'];
        $role->saveOrFail();

        DB::commit();

        return Response::json([
            'role' => $role,
        ], 'El rol ha sido actualizado con éxito.');

    }

    public function delete(int $roleId)
    {
        $role = Role::whereNotNull('created_at')->findOrFail($roleId);

        DB::beginTransaction();

        $role->delete();

        DB::commit();

        return Response::json([
            'role' => $role->load('users'),
        ], 'El rol ha sido eliminado con éxito.');
    }

    /* -------------------- */

    public function syncPermissions(int $roleId)
    {
        $role = Role::where('name', '!=', 'Root')->findOrFail($roleId);

        $input = request()->post();
        $validated = Validator::make($input, RoleSyncPermissionRequest::rules())->validate();

        DB::beginTransaction();

        $role->syncPermissions($validated['permissions']);

        DB::commit();

        return Response::json([
            'role' => $role,
        ], 'El rol ha sido actualizado con éxito.');

    }
}
