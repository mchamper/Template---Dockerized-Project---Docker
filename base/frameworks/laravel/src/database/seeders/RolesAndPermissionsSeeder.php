<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
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

        collect([
            ['id' => 1, 'name' => 'system-user.create'],
            ['id' => 2, 'name' => 'system-user.update'],
            ['id' => 3, 'name' => 'system-user.delete'],
            ['id' => 4, 'name' => 'system-user.activate'],
            ['id' => 5, 'name' => 'system-user.deactivate'],
            ['id' => 6, 'name' => 'channel.create'],
            ['id' => 7, 'name' => 'channel.update'],
            ['id' => 8, 'name' => 'channel.delete'],
            ['id' => 9, 'name' => 'channel.activate'],
            ['id' => 10, 'name' => 'channel.deactivate'],
        ])->map(function ($item) {
            return Arr::add($item, 'guard_name', 'api_system_user');
        })->each(function ($item) {
            DB::table(config('permission.table_names.permissions'))->updateOrInsert(['id' => $item['id']], $item);
        });

        collect([
            ['id' => 1, 'name' => 'root'],
            ['id' => 2, 'name' => 'admin'],
            ['id' => 3, 'name' => 'client'],
        ])->map(function ($item) {
            return Arr::add($item, 'guard_name', 'api_system_user');
        })->each(function ($item) {
            DB::table(config('permission.table_names.roles'))->updateOrInsert(['id' => $item['id']], $item);
        });

        /* -------------------- */

        Role::findByName('root')->givePermissionTo(Permission::all());
        // Role::findByName('Client')->givePermissionTo(['publish articles', 'unpublish articles']);
    }
}
