<?php

namespace App\Providers;

use App\Models\SystemUser;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Gate;
use Laravel\Telescope\IncomingEntry;
use Laravel\Telescope\Telescope;
use Laravel\Telescope\TelescopeApplicationServiceProvider;

class TelescopeServiceProvider extends TelescopeApplicationServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Telescope::night();

        $this->hideSensitiveRequestDetails();

        $isLocal = $this->app->environment('local');

        Telescope::filter(function (IncomingEntry $entry) use ($isLocal) {
            return true;

            // return $isLocal ||
            //        $entry->isReportableException() ||
            //        $entry->isFailedRequest() ||
            //        $entry->isFailedJob() ||
            //        $entry->isScheduledTask() ||
            //        $entry->hasMonitoredTag();
        });
    }

    /**
     * Prevent sensitive request details from being logged by Telescope.
     */
    protected function hideSensitiveRequestDetails(): void
    {
        if ($this->app->environment('local')) {
            return;
        }

        Telescope::hideRequestParameters(['_token']);

        Telescope::hideRequestHeaders([
            'cookie',
            'x-csrf-token',
            'x-xsrf-token',
        ]);
    }

    protected function authorization()
    {
        request()->query('token')
            ? auth()->setDefaultDriver('api_system-user')
            : auth()->setDefaultDriver('web_system-user');

        parent::authorization();
    }

    /**
     * Register the Telescope gate.
     *
     * This gate determines who can access Telescope in non-local environments.
     */
    protected function gate(): void
    {
        Gate::define('viewTelescope', function ($user) {
            $canAccess = $user instanceof SystemUser && in_array($user->email, [
                'root',
            ]);

            if ($canAccess && request()->query('token')) {
                request()->session()->invalidate();

                auth('web_system-user')->loginUsingId($user->id);

                request()->session()->put('expires_at', Carbon::now()->addMinutes(30));
                request()->session()->regenerate();
            }

            return $canAccess;
        });
    }
}
