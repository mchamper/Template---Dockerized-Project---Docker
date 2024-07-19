<?php

namespace App\Console\Commands;

use App\Enums\RoleEnum;
use App\Models\SystemUser;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateRoot extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-root';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Se crea usuario root para el proyecto';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        if (SystemUser::whereEmail('root')->exists()) {
            $this->fail('Ya existe un usuario root en el proyecto.');
        }

        $systemUser = new SystemUser();
        $systemUser->status_id = 1;
        $systemUser->first_name = 'Root';
        $systemUser->last_name = '';
        $systemUser->email = 'root';
        $systemUser->email_verified_at = now();

        app()->environment('local')
            ? $password = '123123'
            : $password = Str::password();

        $systemUser->password = $password;
        $systemUser->saveOrFail();

        $systemUser->assignRole(RoleEnum::Root->name);

        $this->info("Root system user email: {$systemUser->email}");
        $this->info("Root system user password: {$password}");
    }
}
