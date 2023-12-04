<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('telescope:prune --hours=24')->daily();

        $schedule->command('app:media:delete-trashed')->daily();

        /* -------------------- */

        // https://crontab.guru

        // $schedule->command('inspire')
        //     ->everyMinute()
        //     ->cron('* * * * *')
        //     ->withoutOverlapping()
        //     ->sendOutputTo(storage_path('logs/laravel-schedule--inspire.log'))
        //     ;
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
