<?php

namespace Database\Seeders;

use App\Enums\PermissionEnum;
use App\Enums\RoleEnum;
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
            PermissionEnum::class => Permission::class,
            RoleEnum::class => Role::class,
        ];

        foreach ($configs as $enum => $model) {
            $model::whereNot(function ($query) use ($enum) {
                $query->whereIn('name', $enum::names())->where('guard_name', '*');
            })->whereNull('created_at')->delete();

            collect($enum::names())->map(function ($item, $key) {
                return [
                    'name' => $item,
                    'guard_name' => '*',
                    'created_at' => null,
                    'updated_at' => null,
                ];
            })->each(fn ($item) => $model::updateOrCreate($item));
        }

        /* -------------------- */

        RoleEnum::Root->model()
            ->syncPermissions(collect(PermissionEnum::names())->diff([
                //
            ]));

        RoleEnum::Admin->model()
            ->syncPermissions(collect(PermissionEnum::names())->diff([
                PermissionEnum::SystemUserLoginAs->name,
            ]));
    }
}
