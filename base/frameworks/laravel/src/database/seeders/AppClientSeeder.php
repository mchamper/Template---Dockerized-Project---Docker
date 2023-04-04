<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AppClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (app()->environment('local')) {
            collect([
                [
                    'id' => 1,
                    'name' => null,
                    'key' => '1|local',
                    'secret' => bcrypt('local'),
                    'scopes' => json_encode('*'),
                    'hosts' => json_encode('*'),
                ],
                [
                    'id' => 2,
                    'name' => null,
                    'key' => '2|local',
                    'secret' => bcrypt('local'),
                    'scopes' => json_encode([
                        'auth/v1/',
                        'api/v1/web/',
                    ]),
                    'hosts' => json_encode('*'),
                ],
                [
                    'id' => 3,
                    'name' => null,
                    'key' => '3|local',
                    'secret' => bcrypt('local'),
                    'scopes' => json_encode([
                        'auth/v1/',
                        'api/v1/backoffice/',
                    ]),
                    'hosts' => json_encode('*'),
                ],
            ])->each(function ($item) {
                DB::table('app_clients')->updateOrInsert(['id' => $item['id']], $item);
            });
        }
    }
}
