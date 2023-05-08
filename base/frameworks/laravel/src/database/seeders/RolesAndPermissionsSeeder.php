<?php

namespace Database\Seeders;

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

        collect(PermissionEnum::names())->map(function ($item, $key) {
            return [
                'id' => $key + 1,
                'name' => $item,
                'guard_name' => 'system_user',
            ];
        })->each(function ($item) {
            DB::table(config('permission.table_names.permissions'))->updateOrInsert(['id' => $item['id']], $item);
        });

        collect(RoleEnum::names())->map(function ($item, $key) {
            return [
                'id' => $key + 1,
                'name' => $item,
                'guard_name' => 'system_user',
            ];
        })->each(function ($item) {
            DB::table(config('permission.table_names.roles'))->updateOrInsert(['id' => $item['id']], $item);
        });

        /* -------------------- */

        Role::findByName(RoleEnum::Root->name, 'system_user')->givePermissionTo(Permission::all());
    }
}
