<?php

namespace App\Http\Middleware;

use App\Commons\Auth\Auth;
use Illuminate\Http\Middleware\TrustHosts as Middleware;

class TrustHosts extends Middleware
{
    /**
     * Get the host patterns that should be trusted.
     *
     * @return array<int, string|null>
     */
    public function hosts(): array
    {
        // return [
        //     $this->allSubdomainsOfApplicationUrl(),
        // ];

        $appClient = Auth::appClient();

        if (!$appClient || $appClient->hosts === '*') {
            return [];
        }

        return $appClient->hosts;
    }
}
