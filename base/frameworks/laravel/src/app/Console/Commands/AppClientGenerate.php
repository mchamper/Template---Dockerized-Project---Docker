<?php

namespace App\Console\Commands;

use App\Apis\Google\GoogleContactApi;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AppClientGenerate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app-client:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Se crean las credenciales base para el proyecto';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        collect([
            [
                'id' => 1,
                'name' => 'Root',
                'key' => '1|local',
                'secret' => 'local',
                'scopes' => json_encode('*'),
                'hosts' => json_encode('*'),
            ],
            [
                'id' => 10,
                'name' => 'Api v1 --- Public',
                'key' => '10|local',
                'secret' => 'local',
                'scopes' => json_encode([
                    'auth/v1/',
                    'api/v1/public/',
                ]),
                'hosts' => json_encode('*'),
            ],
            [
                'id' => 20,
                'name' => 'Api v1 --- Private',
                'key' => '20|local',
                'secret' => 'local',
                'scopes' => json_encode([
                    'auth/v1/',
                    'api/v1/private/',
                ]),
                'hosts' => json_encode([
                    'example.com',
                    '*.example.com'
                ]),
            ],
            [
                'id' => 30,
                'name' => 'Api v1 --- Web',
                'key' => '30|local',
                'secret' => 'local',
                'scopes' => json_encode([
                    'auth/v1/',
                    'api/v1/web/',
                ]),
                'hosts' => json_encode([
                    'example.com',
                    'www.example.com'
                ]),
            ],
            [
                'id' => 40,
                'name' => 'Api v1 --- Mobile',
                'key' => '40|local',
                'secret' => 'local',
                'scopes' => json_encode([
                    'auth/v1/',
                    'api/v1/mobile/',
                ]),
                'hosts' => json_encode([
                    'localhost',
                ]),
            ],
            [
                'id' => 50,
                'name' => 'Api v1 --- Backoffice',
                'key' => '50|local',
                'secret' => 'local',
                'scopes' => json_encode([
                    'auth/v1/',
                    'api/v1/backoffice/',
                ]),
                'hosts' => json_encode([
                    'backoffice.example.com'
                ]),
            ],
        ])->map(function ($item) {
            if (!app()->environment('local')) {
                $item['key'] = Str::random();
                $item['secret'] = Str::password();
            }

            $this->info($item['name'] . ': Key => "' . $item['key'] . '", Secret => "' . $item['secret'] . '"');

            $item['secret'] = bcrypt($item['secret']);

            return $item;
        })->each(function ($item) {
            DB::table('app_clients')->updateOrInsert(['id' => $item['id']], $item);
        });
    }
}
