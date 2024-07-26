<?php

namespace Database\Seeders;

use App\Enums\RolesAndPermissions\SystemUser_PermissionEnum;
use App\Enums\RolesAndPermissions\SystemUser_RoleEnum;
use Illuminate\Database\Seeder;
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

        /* -------------------- */

        $configs = [
            SystemUser_PermissionEnum::class => Permission::class,
            SystemUser_RoleEnum::class => Role::class,
        ];

        foreach ($configs as $enum => $model) {
            $model::whereNot(function ($query) use ($enum) {
                $query->whereIn('name', $enum::names())->where('guard_name', $enum::guard());
            })->whereNull('created_at')->delete();

            collect($enum::names())->map(function ($item, $key) use ($enum) {
                return [
                    'name' => $item,
                    'guard_name' => $enum::guard(),
                    'created_at' => null,
                    'updated_at' => null,
                ];
            })->each(fn ($item) => $model::updateOrCreate($item));
        }

        /* -------------------- */

        SystemUser_RoleEnum::Root->model()
            ->syncPermissions(collect(SystemUser_PermissionEnum::names())->diff([
                //
            ]));

        SystemUser_RoleEnum::Admin->model()
            ->syncPermissions(collect(SystemUser_PermissionEnum::names())->diff([
                SystemUser_PermissionEnum::SystemUserLoginAs->name,
            ]));
    }
}
