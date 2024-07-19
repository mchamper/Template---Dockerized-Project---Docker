<?php

namespace Database\Seeders;

use App\Models\AuthStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AuthStatusSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            [
                'id' => 1,
                'name' => 'Activo',
            ],
            [
                'id' => 2,
                'name' => 'Inactivo',
            ],
            [
                'id' => 3,
                'name' => 'Deshabilitado',
            ],
            [
                'id' => 4,
                'name' => 'Bloqueado',
            ]
        ])->each(fn ($item) => DB::table('auth_statuses')->updateOrInsert(['id' => $item['id']], $item));
        // ])->each(fn ($item) => AuthStatus::updateOrCreate(['id' => $item['id']], $item));
    }
}
