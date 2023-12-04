<?php

namespace App\Console\Commands;

use App\Enums\RoleEnum;
use App\Models\SystemUser;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class SystemUserGenerateRoot extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:system-user:generate-root';

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
        $systemUser = new SystemUser();
        $systemUser->first_name = 'Root';
        $systemUser->last_name = '';
        $systemUser->email = 'root';
        $systemUser->email_verified_at = now();

        app()->environment('local')
            ? $password = 'master122333'
            : $password = Str::password();

        $systemUser->password = $password;
        $systemUser->saveOrFail();

        $systemUser->assignRole(RoleEnum::Root->name);

        $this->info('SystemUser (Root) email: ' . $systemUser->email);
        $this->info('SystemUser (Root) password: ' . $password);
    }
}
