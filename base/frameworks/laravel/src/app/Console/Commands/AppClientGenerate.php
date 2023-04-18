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
                'scopes' => json_encode('*'),
                'hosts' => json_encode('*'),
            ],
            [
                'id' => 10,
                'name' => 'Api v1 --- External',
                'scopes' => json_encode([
                    'api/v1/external',
                ]),
                'hosts' => json_encode('*'),
            ],
            [
                'id' => 20,
                'name' => 'Api v1 --- Internal',
                'scopes' => json_encode([
                    'api/v1/internal',
                ]),
                'hosts' => json_encode([
                    '^https:\/\/example\.com$',
                    '^https:\/\/(.+)\.example\.com$',
                ]),
            ],
            [
                'id' => 30,
                'name' => 'Api v1 --- Website',
                'scopes' => json_encode([
                    'api/v1/website',
                ]),
                'hosts' => json_encode([
                    '^https:\/\/example\.com$',
                    '^https:\/\/www\.example\.com$',
                ]),
            ],
            [
                'id' => 40,
                'name' => 'Api v1 --- Webapp',
                'scopes' => json_encode([
                    'api/v1/webapp',
                ]),
                'hosts' => json_encode([
                    '^https:\/\/app\.example\.com$',
                ]),
            ],
            [
                'id' => 50,
                'name' => 'Api v1 --- Mobile',
                'scopes' => json_encode([
                    'api/v1/mobile',
                ]),
                'hosts' => json_encode([
                    '^http:\/\/localhost$',
                ]),
            ],
            [
                'id' => 60,
                'name' => 'Api v1 --- Backoffice',
                'scopes' => json_encode([
                    'api/v1/backoffice',
                ]),
                'hosts' => json_encode([
                    '^https:\/\/backoffice\.example\.com$',
                ]),
            ],
        ])->map(function ($item) {
            if (!app()->environment('local')) {
                $item['key'] = Str::random();
                $item['secret'] = Str::password();
            } else {
                $item['key'] = $item['id'] . '|' . 'local';
                $item['secret'] = 'local';
            }

            $this->info($item['name'] . ': Key => "' . $item['key'] . '", Secret => "' . $item['secret'] . '"');

            $item['secret'] = bcrypt($item['secret']);

            return $item;
        })->each(function ($item) {
            DB::table('app_clients')->updateOrInsert(['id' => $item['id']], $item);
        });
    }
}
