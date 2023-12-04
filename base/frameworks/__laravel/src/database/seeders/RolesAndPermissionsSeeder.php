<?php

namespace Database\Seeders;

use App\Commons\Auth\Auth;
use App\Enums\PermissionEnum;
use App\Enums\RoleEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        foreach ([Auth::$systemUserGuard] as $guardKey => $guard) {
            collect(PermissionEnum::names())->map(function ($item, $key) use ($guardKey, $guard) {
                return [
                    'id' => $key + 1 + ($guardKey * 1000),
                    'name' => $item,
                    'guard_name' => $guard,
                ];
            })->each(function ($item) {
                DB::table(config('permission.table_names.permissions'))->updateOrInsert(['id' => $item['id']], $item);
            });
        }

        foreach ([Auth::$systemUserGuard] as $guardKey => $guard) {
            collect(RoleEnum::names())->map(function ($item, $key) use ($guardKey, $guard) {
                return [
                    'id' => $key + 1 + ($guardKey * 100),
                    'name' => $item,
                    'guard_name' => Auth::$systemUserGuard,
                ];
            })->each(function ($item) {
                DB::table(config('permission.table_names.roles'))->updateOrInsert(['id' => $item['id']], $item);
            });
        }

        /* -------------------- */

        Role::findByName(RoleEnum::Root->name, Auth::$systemUserGuard)
            ->syncPermissions(Permission::whereGuardName(Auth::$systemUserGuard)->get());

        Role::findByName(RoleEnum::Admin->name, Auth::$systemUserGuard)
            ->syncPermissions(Permission::whereGuardName(Auth::$systemUserGuard)->get());
    }
}
