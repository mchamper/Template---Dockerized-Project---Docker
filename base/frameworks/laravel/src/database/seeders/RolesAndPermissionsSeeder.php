<?php

namespace Database\Seeders;

use App\Enums\PermissionEnum;
use App\Enums\RoleEnum;
use App\Facades\Auth;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

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

        DB::table(config('permission.table_names.permissions'))
            ->whereNot(function ($query) {
                $query->whereIn('name', PermissionEnum::names())
                    ->where('guard_name', Auth::getSystemUserGuardName())
                    ;
            })
            ->delete();
            ;

        DB::table(config('permission.table_names.roles'))
            ->whereNot(function ($query) {
                $query->whereIn('name', RoleEnum::names())
                    ->where('guard_name', Auth::getSystemUserGuardName())
                    ;
            })
            ->whereNull('created_at')
            ->delete();
            ;

        /* -------------------- */

        collect(PermissionEnum::names())->map(function ($item, $key) {
            return [
                'name' => $item,
                'guard_name' => Auth::getSystemUserGuardName(),
            ];
        })->each(function ($item) {
            DB::table(config('permission.table_names.permissions'))->updateOrInsert($item, $item);
        });

        collect(RoleEnum::names())->map(function ($item, $key) {
            return [
                'name' => $item,
                'guard_name' => Auth::getSystemUserGuardName(),
            ];
        })->each(function ($item) {
            DB::table(config('permission.table_names.roles'))->updateOrInsert($item, $item);
        });

        /* -------------------- */

        RoleEnum::Root->model()
            ->syncPermissions(PermissionEnum::names());

        RoleEnum::Admin->model()
            ->syncPermissions(PermissionEnum::names());
    }
}
