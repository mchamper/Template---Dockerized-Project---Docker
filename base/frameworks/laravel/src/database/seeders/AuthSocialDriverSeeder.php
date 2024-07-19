<?php

namespace Database\Seeders;

use App\Models\AuthSocialDriver;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AuthSocialDriverSeeder extends Seeder
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
                'name' => 'Google',
            ],
        ])->each(fn ($item) => DB::table('auth_social_drivers')->updateOrInsert(['id' => $item['id']], $item));
        // ])->each(fn ($item) => AuthSocialDriver::updateOrCreate(['id' => $item['id']], $item));
    }
}
